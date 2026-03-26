import React, { useState, useCallback, useRef, useEffect } from 'react';

const SearchInput = React.memo(({ onSearch, initialValue = "", placeholder = "Type to search products..." }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(initialValue);
  const inputRef = useRef(null);
  
  // Update local state when initialValue changes (but only if it's different)
  useEffect(() => {
    if (initialValue !== localSearchTerm) {
      setLocalSearchTerm(initialValue);
    }
  }, [initialValue]);
  
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    console.log('📝 Search input changed to:', value);
    setLocalSearchTerm(value);
    onSearch(value);
  }, [onSearch]);

  const handleFocus = useCallback(() => {
    console.log('🎯 Search input focused');
  }, []);

  const handleBlur = useCallback(() => {
    console.log('❌ Search input blurred');
  }, []);

  return (
    <div className="input-group">
      <input
        ref={inputRef}
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={localSearchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <span className="input-group-text bg-light">
        <i className="fa fa-search text-muted"></i>
      </span>
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput; 