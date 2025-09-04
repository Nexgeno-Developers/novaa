export function serializeDocument(doc: any): any {
  if (doc === null || doc === undefined) {
    return doc;
  }
  
  if (typeof doc !== 'object') {
    return doc;
  }
  
  if (Array.isArray(doc)) {
    return doc.map(serializeDocument);
  }
  
  // Handle MongoDB ObjectId
  if (doc._id && typeof doc._id === 'object' && doc._id.toString) {
    doc._id = doc._id.toString();
  }
  
  const serialized: any = {};
  
  for (const key in doc) {
    if (doc.hasOwnProperty(key)) {
      const value = doc[key];
      
      // Convert ObjectId to string
      if (value && typeof value === 'object' && value.toString && value.constructor.name === 'ObjectId') {
        serialized[key] = value.toString();
      }
      // Convert Date to ISO string
      else if (value instanceof Date) {
        serialized[key] = value.toISOString();
      }
      // Recursively serialize nested objects and arrays
      else if (value && typeof value === 'object') {
        serialized[key] = serializeDocument(value);
      }
      // Keep primitive values as is
      else {
        serialized[key] = value;
      }
    }
  }
  
  return serialized;
}