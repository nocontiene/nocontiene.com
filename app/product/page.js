import product from "models/product.js";

export default function Product({ productListFound }) {
  return (
    <>
      <h1>Produtos</h1>
      <button>Adicionar produto</button>
      {productListFound.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </>
  );
}

export const getStaticProps = async () => {
  const results = await product.findAll();
  const productListFound = results;

  return {
    props: {
      productListFound,
    },
  };
};
