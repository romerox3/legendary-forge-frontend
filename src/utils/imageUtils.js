export const getImageUrl = (imageUrl) => {
    console.log(imageUrl);
    return `http://localhost:5000/static${imageUrl}`;
  };
  