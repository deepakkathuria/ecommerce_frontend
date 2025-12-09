# Admin Panel - Material Field Addition Instructions

## Instructions for Cursor AI

Add a **Material** field to the admin panel product forms (both Create and Edit). Follow these exact steps:

---

## STEP 1: Find Product Create Form

**Task:** Locate the file where the product creation form is rendered (likely in admin panel directory, could be named like `AddProduct.jsx`, `CreateProduct.jsx`, `ProductForm.jsx`, or similar).

**What to look for:**
- Form with fields like: `name`, `price`, `category`, `subcategory`, `stock_quantity`, etc.
- Form submission that calls `/admin/products` POST endpoint
- State management with fields like `formData` or individual state variables

---

## STEP 2: Add Material Field to Create Form

**In the Create Product Form file, make these changes:**

1. **Add Material to State/FormData:**
   - If using `useState` for form data, add: `const [material, setMaterial] = useState("");`
   - If using a form object, add: `material: ""` to the initial state

2. **Add Material Dropdown Field in JSX:**
   - Place it **AFTER the `subcategory` field** and **BEFORE** other fields
   - Add this JSX code:

```jsx
{/* Material Field */}
<div className="form-group mb-3">
  <label htmlFor="material" className="form-label">
    Material <span className="text-muted">(Optional)</span>
  </label>
  <select
    id="material"
    className="form-control"
    value={material} // or formData.material if using object
    onChange={(e) => setMaterial(e.target.value)} // or update formData
  >
    <option value="">Select Material (Optional)</option>
    <option value="antitarnish">Antitarnish</option>
    <option value="brass">Brass</option>
  </select>
  <small className="form-text text-muted">
    Select material type for jewellery products
  </small>
</div>
```

3. **Update API Call:**
   - Find the function that submits the form (usually `handleSubmit` or `onSubmit`)
   - In the API request body, add `material: material` (or `material: formData.material`)
   - The API endpoint is: `POST /admin/products`
   - Make sure `material` is included in the `fetch` body along with other fields

**Example API call structure:**
```javascript
const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/admin/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    name,
    price,
    stock_quantity,
    category,
    subcategory,
    material, // ✅ ADD THIS
    // ... other fields
  }),
});
```

---

## STEP 3: Find Product Edit Form

**Task:** Locate the file where the product edit/update form is rendered (likely named like `EditProduct.jsx`, `UpdateProduct.jsx`, or uses the same form component with an `id` prop).

**What to look for:**
- Form that fetches product data using `/admin/product/:productId` GET endpoint
- Form that submits updates using `/admin/product/:productId` PUT endpoint
- Pre-filled form fields with existing product data

---

## STEP 4: Add Material Field to Edit Form

**In the Edit Product Form file, make these changes:**

1. **Add Material to State:**
   - Add `material` to the state (same as create form)
   - Initialize it from fetched product data

2. **Fetch Material from API:**
   - When fetching product data, ensure `material` is included in the response
   - Set it in state: `setMaterial(product.material || "")`

3. **Add Material Dropdown Field in JSX:**
   - Place it **AFTER the `subcategory` field**
   - Use the same JSX code as Step 2, but ensure the value is pre-filled from product data

4. **Update API Call:**
   - In the update/submit function, add `material: material` to the request body
   - The API endpoint is: `PUT /admin/product/:productId`

**Example API call structure:**
```javascript
const response = await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/admin/product/${productId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    name,
    price,
    stock_quantity,
    category,
    subcategory,
    material, // ✅ ADD THIS
    // ... other fields
  }),
});
```

---

## STEP 5: Optional - Add Material Column to Product List Table

**If there's a product list/table view in admin panel:**

1. **Add Material Column Header:**
   - Add a `<th>Material</th>` in the table header row

2. **Display Material in Table Rows:**
   - In each product row, add: `<td>{product.material || "—"}</td>`

---

## Important Notes:

1. **Field Placement:** Material field should be placed **immediately after `subcategory` field** in both forms
2. **Field Type:** Use a `<select>` dropdown with options: "Select Material (Optional)", "antitarnish", "brass"
3. **Optional Field:** Material is optional (can be empty/null), so don't make it required
4. **API Integration:** Ensure `material` is sent in both CREATE (POST) and UPDATE (PUT) API calls
5. **Data Format:** Send material in lowercase: `"antitarnish"` or `"brass"` (API will handle trimming)

---

## Verification Checklist:

After making changes, verify:
- [ ] Material dropdown appears in Create Product form
- [ ] Material dropdown appears in Edit Product form
- [ ] Material value is pre-filled when editing existing product
- [ ] Material is sent in POST request when creating product
- [ ] Material is sent in PUT request when updating product
- [ ] Material field is optional (can be left empty)

---

## Example Complete Form Field Structure:

```jsx
{/* Category Field */}
<div className="form-group mb-3">
  <label>Category</label>
  <select value={category} onChange={(e) => setCategory(e.target.value)}>
    {/* options */}
  </select>
</div>

{/* Subcategory Field */}
<div className="form-group mb-3">
  <label>Subcategory</label>
  <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
    {/* options */}
  </select>
</div>

{/* ✅ Material Field - ADD THIS HERE */}
<div className="form-group mb-3">
  <label htmlFor="material" className="form-label">
    Material <span className="text-muted">(Optional)</span>
  </label>
  <select
    id="material"
    className="form-control"
    value={material}
    onChange={(e) => setMaterial(e.target.value)}
  >
    <option value="">Select Material (Optional)</option>
    <option value="antitarnish">Antitarnish</option>
    <option value="brass">Brass</option>
  </select>
  <small className="form-text text-muted">
    Select material type for jewellery products
  </small>
</div>

{/* Other fields continue... */}
```

---

**End of Instructions**

