
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeadsManagementApp = () => {
  const [leads, setLeads] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [filters, setFilters] = useState({
    search: '',
    postcode: '',
    status: '',
    type: '',
    broker: '',
    subscription: '',
    from: '',
    until: '',
    page: 1,
    limit: 10
  });

  const statusOptions = ['new', 'no feedback', 'In Progress', 'waiting', 'no success', 'Order placed', 'completed'];
  const typeOptions = ['Salesperson', 'Buyer'];
  const brokerOptions = ['Prime', 'Davitec GmbH', 'Broker GmbH main location'];
  const subscriptionOptions = ['Prepaid', 'Premium'];

  // Fetch leads from the backend API
  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.postcode) params.append('postcode', filters.postcode);
        if (filters.status) params.append('status', filters.status);
        if (filters.type) params.append('type', filters.type);
        if (filters.broker) params.append('broker', filters.broker);
        if (filters.subscription) params.append('subscription', filters.subscription);
        if (filters.from) params.append('from', filters.from);
        if (filters.until) params.append('until', filters.until);
        params.append('page', filters.page);
        params.append('limit', filters.limit);

        // Make API call
        const response = await axios.get(`http://localhost:5000/api/leads?${params.toString()}`);
        
        setLeads(response.data.leads);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError('Failed to fetch leads. Please try again later.');
        setLeads([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      postcode: '',
      status: '',
      type: '',
      broker: '',
      subscription: '',
      from: '',
      until: '',
      page: 1,
      limit: 10
    });
  };

  const handlePageChange = (delta) => {
    const nextPage = filters.page + delta;
    if (nextPage >= 1 && nextPage <= totalPages) {
      setFilters(prev => ({
        ...prev,
        page: nextPage
      }));
    }
  };

  // Handle change for items per page dropdown
  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setFilters(prev => ({
      ...prev,
      limit: newLimit,
      page: 1 // Reset to first page when limit changes
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center">
          <div className="flex items-center">
            <svg 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="h-8 w-8 text-teal-700"
            >
              <path d="M21,8V7L18,9L15,7V8L18,10L21,8M21,16V15L18,17L15,15V16L18,18L21,16M4,5V7H11V5H4M4,9V11H11V9H4M4,13V15H11V13H4M15,11V13H21V11H15M15,5V7H21V5H15M4,17V19H21V17H4Z" />
            </svg>
            <h1 className="ml-2 text-2xl font-semibold text-teal-700">Leads</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Search Bar Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by customer number, lead ID, property ID, agent, name..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-1/3">
              <input
                type="text"
                placeholder="Search by postcode"
                value={filters.postcode}
                onChange={(e) => handleFilterChange('postcode', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex items-center">
                <span className="mr-2">From</span>
                <input
                  type="date"
                  value={filters.from}
                  onChange={(e) => handleDateChange('from', e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <span className="mx-2">Until</span>
                <input
                  type="date"
                  value={filters.until}
                  onChange={(e) => handleDateChange('until', e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="mr-2 flex items-center">
                <span className="font-medium mr-2">Status:</span>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status}
                      onClick={() => handleFilterChange('status', filters.status === status ? '' : status)}
                      className={`px-3 py-1 rounded-full text-sm font-medium 
                        ${filters.status === status 
                          ? 'bg-teal-700 text-black' 
                          : 'bg-teal-700 bg-opacity-20 text-white'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center">
                <span className="font-medium mr-2">Subscription:</span>
                <div className="flex gap-2">
                  {subscriptionOptions.map(subscription => (
                    <button
                      key={subscription}
                      onClick={() => handleFilterChange('subscription', filters.subscription === subscription ? '' : subscription)}
                      className={`px-3 py-1 rounded-full text-sm font-medium 
                        ${filters.subscription === subscription 
                          ? 'bg-teal-700 text-black' 
                          : 'bg-teal-700 bg-opacity-20 text-white'}`}
                    >
                      {subscription}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center">
                <span className="font-medium mr-2">Lead object type:</span>
                <div className="flex gap-2">
                  {typeOptions.map(type => (
                    <button
                      key={type}
                      onClick={() => handleFilterChange('type', filters.type === type ? '' : type)}
                      className={`px-3 py-1 rounded-full text-sm font-medium 
                        ${filters.type === type 
                          ? 'bg-teal-700 text-black' 
                          : 'bg-teal-700 bg-opacity-20 text-white'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <span className="font-medium mr-2">Broker:</span>
                <div className="flex gap-2">
                  {brokerOptions.map(broker => (
                    <button
                      key={broker}
                      onClick={() => handleFilterChange('broker', filters.broker === broker ? '' : broker)}
                      className={`px-3 py-1 rounded-full text-sm font-medium 
                        ${filters.broker === broker 
                          ? 'bg-teal-700 text-black' 
                          : 'bg-teal-700 bg-opacity-20 text-white'}`}
                    >
                      {broker}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Reset Filters Button */}
            {(filters.search || filters.postcode || filters.status || filters.type || 
              filters.broker || filters.subscription || filters.from || filters.until) && (
              <div className="mt-4">
                <button 
                  onClick={resetFilters}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Lead ID</th>
                  <th className="py-3 px-4 text-left">Object ID</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Company</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Activity Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-4 text-center">
                      <div className="flex justify-center items-center">
                        <svg className="animate-spin h-5 w-5 text-teal-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="ml-2">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-4 text-center">No leads found</td>
                  </tr>
                ) : (
                  leads.map((lead, index) => {
                    // Format date for display (assuming date comes from API in ISO format)
                    const formatDate = (dateString) => {
                      if (!dateString) return '';
                      const date = new Date(dateString);
                      return date.toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit'
                      }).replace(/\//g, '.');
                    };
                    
                    return (
                      <tr key={lead._id || index} className={index % 2 === 0 ? 'bg-amber-50' : 'bg-white'}>
                        <td className="py-3 px-4 border-b">{formatDate(lead.date)}</td>
                        <td className="py-3 px-4 border-b">{lead.leadId}</td>
                        <td className="py-3 px-4 border-b">{lead.objectId}</td>
                        <td className="py-3 px-4 border-b">{lead.type}</td>
                        <td className="py-3 px-4 border-b">{lead.company}</td>
                        <td className="py-3 px-4 border-b">{lead.name}</td>
                        <td className="py-3 px-4 border-b">{formatDate(lead.activityDate)}</td>
                        <td className="py-3 px-4 border-b">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${lead.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              lead.status === 'no success' ? 'bg-red-100 text-red-800' :
                              lead.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                              lead.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              lead.status === 'Order placed' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center">
              <span className="mr-2">Items per page:</span>
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="appearance-none bg-white border border-gray-300 px-3 py-1 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              <span className="ml-4">
                {leads.length > 0 ? `${(filters.page - 1) * filters.limit + 1} - ${Math.min(filters.page * filters.limit, (filters.page - 1) * filters.limit + leads.length)} of ${(totalPages * filters.limit)}` : '0 of 0'}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(-1)}
                disabled={filters.page === 1}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-full disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={() => handlePageChange(1)}
                disabled={filters.page === totalPages}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-full disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeadsManagementApp;