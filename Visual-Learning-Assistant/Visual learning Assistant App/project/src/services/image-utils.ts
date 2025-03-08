export async function processImage(base64Image: string) {
  // Remove the data URL prefix if present
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  return base64Data; // Return only the Base64 data
}