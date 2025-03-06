import { ProductMutationStatusColorsConstant } from "@/constant/productMutationConstant";

export const getProductMutationStatusColor = (status: string): string => {
  const key =
    status.toLowerCase() as keyof typeof ProductMutationStatusColorsConstant;
  return (
    ProductMutationStatusColorsConstant[key] ||
    ProductMutationStatusColorsConstant.default
  );
};
