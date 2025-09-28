import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Mail,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { newsletterApi } from '../services/api';
import { NewsletterEmail, FilterOptions } from '../types';
import { formatDate, getStatusColor, getStatusText, downloadFile } from '../lib/utils';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [emails, setEmails] = useState<NewsletterEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [newsletterForm, setNewsletterForm] = useState({
    subject: '',
    content: '',
    recipients: [] as string[],
  });

  useEffect(() => {
    fetchEmails();
  }, [pagination.page, filters]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await newsletterApi.getAll(
        pagination.page,
        pagination.limit,
        filters
      );
      setEmails(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        totalPages: response.data.totalPages,
      }));
    } catch (error: any) {
      toast.error('Failed to fetch newsletter emails');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await newsletterApi.updateStatus(id, status);
      toast.success('Status updated successfully');
      fetchEmails();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const handleBulkStatusChange = async (status: string) => {
    if (selectedEmails.length === 0) {
      toast.error('Please select emails first');
      return;
    }

    try {
      await newsletterApi.bulkUpdate(selectedEmails, status);
      toast.success('Status updated successfully');
      setSelectedEmails([]);
      fetchEmails();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this email?')) return;
    
    try {
      await newsletterApi.delete(id);
      toast.success('Email deleted successfully');
      fetchEmails();
    } catch (error: any) {
      toast.error('Failed to delete email');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEmails.length === 0) {
      toast.error('Please select emails first');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedEmails.length} emails?`)) return;

    try {
      for (const id of selectedEmails) {
        await newsletterApi.delete(id);
      }
      toast.success('Emails deleted successfully');
      setSelectedEmails([]);
      fetchEmails();
    } catch (error: any) {
      toast.error('Failed to delete emails');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await newsletterApi.export(filters);
      downloadFile(blob, `newsletter-emails-${new Date().toISOString().split('T')[0]}.csv`);
      toast.success('Export completed');
    } catch (error: any) {
      toast.error('Failed to export data');
    }
  };

  const handleSelectEmail = (id: string) => {
    setSelectedEmails(prev => 
      prev.includes(id) 
        ? prev.filter(emailId => emailId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmails.length === emails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emails.map(email => email._id));
    }
  };

  const handleSendNewsletter = async () => {
    if (!newsletterForm.subject || !newsletterForm.content) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await newsletterApi.sendNewsletter(
        newsletterForm.subject,
        newsletterForm.content,
        newsletterForm.recipients
      );
      toast.success('Newsletter sent successfully');
      setShowSendModal(false);
      setNewsletterForm({ subject: '', content: '', recipients: [] });
    } catch (error: any) {
      toast.error('Failed to send newsletter');
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'unsubscribed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'bounced':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Newsletter Management</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Manage newsletter subscribers and send campaigns
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setShowSendModal(true)}
            className="btn-primary flex items-center justify-center w-full sm:w-auto"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Newsletter
          </button>
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center justify-center w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedEmails.length > 0 && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedEmails.length} email(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkStatusChange('active')}
                className="btn-primary text-sm"
              >
                Mark as Active
              </button>
              <button
                onClick={() => handleBulkStatusChange('unsubscribed')}
                className="btn-secondary text-sm"
              >
                Mark as Unsubscribed
              </button>
              <button
                onClick={handleBulkDelete}
                className="btn-danger text-sm"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search emails..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          <select
            className="input-field"
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="bounced">Bounced</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header w-12">
                  <input
                    type="checkbox"
                    checked={selectedEmails.length === emails.length && emails.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </th>
                <th className="table-header">Email</th>
                <th className="table-header">Status</th>
                <th className="table-header">Source</th>
                <th className="table-header">Subscribed</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="table-cell text-center py-8">
                    <div className="loading-spinner mx-auto"></div>
                  </td>
                </tr>
              ) : emails.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-cell text-center py-8 text-gray-500">
                    No emails found
                  </td>
                </tr>
              ) : (
                emails.map((email) => (
                  <tr key={email._id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <input
                        type="checkbox"
                        checked={selectedEmails.includes(email._id)}
                        onChange={() => handleSelectEmail(email._id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{email.email}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        {getStatusIcon(email.status)}
                        <select
                          value={email.status}
                          onChange={(e) => handleStatusChange(email._id, e.target.value)}
                          className={`ml-2 status-badge ${getStatusColor(email.status)} border-0 bg-transparent`}
                        >
                          <option value="active">Active</option>
                          <option value="unsubscribed">Unsubscribed</option>
                          <option value="bounced">Bounced</option>
                        </select>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {email.source}
                      </span>
                    </td>
                    <td className="table-cell text-sm text-gray-500">
                      {formatDate(email.subscribedAt)}
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleDelete(email._id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pagination.page
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="loading-spinner"></div>
          </div>
        ) : emails.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No subscribers found
          </div>
        ) : (
          emails.map((email) => (
            <div key={email._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(email._id)}
                    onChange={() => handleSelectEmail(email._id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{email.email}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(email.status)}
                      <span className={`text-xs ${getStatusColor(email.status)}`}>
                        {getStatusText(email.status)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(email._id)}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Source:</span>
                  <span className="text-xs text-gray-700 capitalize">{email.source}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Subscribed:</span>
                  <span className="text-xs text-gray-700">{formatDate(email.subscribedAt)}</span>
                </div>
                {email.unsubscribedAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Unsubscribed:</span>
                    <span className="text-xs text-gray-700">{formatDate(email.unsubscribedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mobile Pagination */}
      {pagination.totalPages > 1 && (
        <div className="lg:hidden flex justify-center space-x-2 py-4">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Send Newsletter Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-3 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowSendModal(false)} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full w-full mx-2">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Send Newsletter
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          value={newsletterForm.subject}
                          onChange={(e) => setNewsletterForm(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Newsletter subject"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Content
                        </label>
                        <textarea
                          className="input-field h-32 resize-none"
                          value={newsletterForm.content}
                          onChange={(e) => setNewsletterForm(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Newsletter content"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Recipients
                        </label>
                        <select
                          className="input-field"
                          value={newsletterForm.recipients.length > 0 ? 'selected' : 'all'}
                          onChange={(e) => {
                            if (e.target.value === 'all') {
                              setNewsletterForm(prev => ({ ...prev, recipients: [] }));
                            } else {
                              setNewsletterForm(prev => ({ ...prev, recipients: selectedEmails }));
                            }
                          }}
                        >
                          <option value="all">All Active Subscribers</option>
                          <option value="selected">Selected Emails Only</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-col sm:flex-row sm:flex-row-reverse space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  className="btn-primary w-full sm:w-auto sm:mr-3"
                  onClick={handleSendNewsletter}
                >
                  Send Newsletter
                </button>
                <button
                  type="button"
                  className="btn-secondary w-full sm:w-auto"
                  onClick={() => setShowSendModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletter;
