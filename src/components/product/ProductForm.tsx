"use client";

import { FC, useState } from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { ProductDetail, ProductImage } from "@/types/models/products";
import { getProductCategory } from "@/app/api/getProducts";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import ImageUpload from "./ImageUploud";
import { cn } from "@/lib/utils";

interface Product {
  name: string;
  price: number;
  description: string;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  images?: ProductImage[];
  categoryId: number;
}

interface ProductFormProps {
  props?: ProductDetail;
}

const ProductForm: FC<ProductFormProps> = ({ props }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: productCategories,
    isLoading: productCategoriesLoading,
    error: productCategoriesError,
  } = useQuery({
    queryKey: ["product-categories"],
    queryFn: getProductCategory,
  });

  const initialValues: Product = {
    name: props?.name ?? "",
    price: props?.price ?? 0,
    description: props?.description ?? "",
    weight: props?.weight ?? 0,
    height: props?.height ?? 0,
    width: props?.width ?? 0,
    length: props?.length ?? 0,
    images: props?.images ?? [],
    categoryId: props?.category.id ?? 0,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must not exceed 100 characters")
      .required("Name is required"),
    price: Yup.number()
      .min(0, "Price must be greater than or equal to 0")
      .required("Price is required"),
    description: Yup.string()
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must not exceed 1000 characters")
      .required("Description is required"),
    weight: Yup.number()
      .min(0, "Weight must be greater than or equal to 0")
      .nullable(),
    height: Yup.number()
      .min(0, "Height must be greater than or equal to 0")
      .nullable(),
    width: Yup.number()
      .min(0, "Width must be greater than or equal to 0")
      .nullable(),
    length: Yup.number()
      .min(0, "Length must be greater than or equal to 0")
      .nullable(),
    categoryId: Yup.number()
      .min(1, "Category is required")
      .required("Category is required"),
    images: Yup.array().min(1, "At least one image is required"),
  });

  const handleOnSubmit = async (values: Product) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting form with values:", values);
      // Add your API call here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (productCategoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (productCategoriesError) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading categories. Please try again later.
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleOnSubmit}
    >
      {({ values, errors, touched }) => (
        <Form className="space-y-6 max-w-2xl">
          {/* Basic Information Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Product Name
                </label>
                <Field
                  name="name"
                  type="text"
                  className={cn(
                    "input-field w-full text-gray-700 h-10 border-2 rounded-md px-3",
                    errors.name && touched.name
                      ? "border-red-500"
                      : "border-gray-200"
                  )}
                  placeholder="Product name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Price
                </label>
                <Field
                  name="price"
                  type="number"
                  className={cn(
                    "input-field w-full text-gray-700 h-10 border-2 rounded-md px-3",
                    errors.price && touched.price
                      ? "border-red-500"
                      : "border-gray-200"
                  )}
                  placeholder="Product price"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  className={cn(
                    "input-field w-full text-gray-700 h-32 border-2 rounded-md p-3",
                    errors.description && touched.description
                      ? "border-red-500"
                      : "border-gray-200"
                  )}
                  placeholder="Product description"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Product Images</h2>
            <div>
              <label className="block text-gray-700 font-medium mb-4">
                Upload up to 5 images
              </label>
              <FieldArray
                name="images"
                render={(arrayHelper) => {
                  const images = arrayHelper.form.values.images;

                  return (
                    <div className="flex gap-4 flex-wrap">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const currentImage = images[index];
                        const previousImage =
                          index > 0 ? images[index - 1] : true;
                        const isDisabled = !previousImage && index !== 0;

                        return (
                          <div
                            key={index}
                            className={cn(isDisabled ? "opacity-50" : "")}
                          >
                            <ImageUpload
                              imageUrl={currentImage?.url}
                              onImageChange={(url) => {
                                if (url === "") {
                                  const updatedImages: ProductImage[] =
                                    images.filter(
                                      (_: ProductImage, i: number) =>
                                        i !== index
                                    );

                                  const reorderedImages = updatedImages.map(
                                    (img, idx) => ({
                                      url: img.url,
                                      position: idx + 1,
                                    })
                                  );

                                  arrayHelper.form.setFieldValue(
                                    "images",
                                    reorderedImages
                                  );
                                } else {
                                  if (currentImage) {
                                    const updatedImages = [...images];
                                    updatedImages[index] = {
                                      url,
                                      position: index + 1,
                                    };
                                    arrayHelper.form.setFieldValue(
                                      "images",
                                      updatedImages
                                    );
                                  } else {
                                    const updatedImages = [
                                      ...images,
                                      {
                                        url,
                                        position: images.length + 1,
                                      },
                                    ];
                                    arrayHelper.form.setFieldValue(
                                      "images",
                                      updatedImages
                                    );
                                  }
                                }
                              }}
                              disabled={isDisabled}
                            />
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              />
              <ErrorMessage
                name="images"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>

          {/* Dimensions Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Product Dimensions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Weight (kg)
                </label>
                <Field
                  name="weight"
                  type="number"
                  className={cn(
                    "input-field w-full text-gray-700 h-10 border-2 rounded-md px-3",
                    errors.weight && touched.weight
                      ? "border-red-500"
                      : "border-gray-200"
                  )}
                  placeholder="Weight"
                />
                <ErrorMessage
                  name="weight"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Height (cm)
                </label>
                <Field
                  name="height"
                  type="number"
                  className={cn(
                    "input-field w-full text-gray-700 h-10 border-2 rounded-md px-3",
                    errors.height && touched.height
                      ? "border-red-500"
                      : "border-gray-200"
                  )}
                  placeholder="Height"
                />
                <ErrorMessage
                  name="height"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Width (cm)
                </label>
                <Field
                  name="width"
                  type="number"
                  className={cn(
                    "input-field w-full text-gray-700 h-10 border-2 rounded-md px-3",
                    errors.width && touched.width
                      ? "border-red-500"
                      : "border-gray-200"
                  )}
                  placeholder="Width"
                />
                <ErrorMessage
                  name="width"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Length (cm)
                </label>
                <Field
                  name="length"
                  type="number"
                  className={cn(
                    "input-field w-full text-gray-700 h-10 border-2 rounded-md px-3",
                    errors.length && touched.length
                      ? "border-red-500"
                      : "border-gray-200"
                  )}
                  placeholder="Length"
                />
                <ErrorMessage
                  name="length"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>
          </div>
          {/* Category Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Category</h2>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Select Category
              </label>
              <Field
                name="categoryId"
                as="select"
                className={cn(
                  "input-field w-full text-gray-700 h-11 border-2 rounded-md px-3",
                  errors.categoryId && touched.categoryId
                    ? "border-red-500"
                    : "border-gray-200"
                )}
              >
                <option value="">Select a category</option>
                {productCategories?.data?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="categoryId"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "px-6 py-2 rounded-md font-medium text-white",
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;
