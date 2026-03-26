import React, { useState, useCallback, useRef, useEffect } from 'react';

const SearchModal = React.memo(({ isOpen, onClose, onSearch, initialValue = "" }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const inputRef = useRef(null);
  
  // Update local state when initialValue changes (but only if it's different)
  useEffect(() => {
    if (initialValue !== searchTerm) {
      setSearchTerm(initialValue);
    }
  }, [initialValue]);
  
  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);
  
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    console.log('📝 Modal search input changed to:', value);
    setSearchTerm(value);
    // Update search immediately as user types
    onSearch(value);
  }, [onSearch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fa fa-search me-2"></i>
              Search Products
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="input-group input-group-lg">
                <input
                  ref={inputRef}
                  type="text"
                  className="form-control"
                  placeholder="Type to search products..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                <button 
                  className="btn btn-primary" 
                  type="submit"
                >
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </form>
            {searchTerm && (
              <div className="mt-3">
                <small className="text-muted">
                  <i className="fa fa-search me-1"></i>
                  Searching for: "{searchTerm}"
                  <br />
                  <span className="text-success">
                    <i className="fa fa-check me-1"></i>
                    Results update in real-time as you type!
                  </span>
                </small>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Close
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={onClose}
            >
              <i className="fa fa-check me-1"></i>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

SearchModal.displayName = 'SearchModal';

export default SearchModal; 