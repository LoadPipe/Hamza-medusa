import type { WidgetConfig } from "@medusajs/admin";

const ProductWidget = () => {
  return (
    <div>
      <h1>Product Widget</h1>
    </div>
  );
};

export const config: WidgetConfig = {
  zone: "product.details.after",
};

export default ProductWidget;
