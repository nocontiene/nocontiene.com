import product from "models/product.js";

export default function Product({ productListFound }) {
  return (
    <>
      {productListFound.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </>
  );
}

export const getStaticProps = async () => {
  const results = await product.findAll();
  const productListFound = results.rows;

  return {
    props: {
      productListFound,
    },
  };
};
