import product from "models/product.js";

export default function ProductDetail({ productFound }) {
  if (!productFound) {
    return <div>Product not found</div>;
  }

  return (
    <div key={productFound.id}>
      {productFound.name}
    </div>
  );
}

export const getStaticProps = async ({ params }) => {
  const results = await product.findById(params.id);
  const productFound = results.rows;

  return {
    props: {
      productFound,
    },
  };
};
