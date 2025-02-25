"use client";

import { FC, useState } from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { ProductDetail, ProductForm } from "@/types/models/products";
import { getProductCategory } from "@/app/api/product/getProducts";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import ImageUpload from "./ImageUploud";
import { cn } from "@/lib/utils";
import { postFileBuilderIo } from "@/app/api/builder-io/postBuilderIo";
import { updateProductById } from "@/app/api/product/putProducts";

interface ProductFormProps {
  props?: ProductDetail;
}

const ProductFormComponent: FC<ProductFormProps> = ({ props }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const {
    data: productCategories,
    isLoading: productCategoriesLoading,
    error: productCategoriesError,
  } = useQuery({
    queryKey: ["product-categories"],
    queryFn: getProductCategory,
  });

  const initialValues: ProductForm = {
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

  const handleOnSubmit = async (values: ProductForm) => {
    if (!props || !props.id) return;

    try {
      setIsSubmitting(true);

      const filesToUpload = imageFiles
        .map((file, index) => ({ file, index }))
        .filter(
          (item): item is { file: File; index: number } => item.file !== null
        );

      const uploadPromises = filesToUpload.map(({ file, index }) =>
        postFileBuilderIo({
          name: `product-${values.name}-${Date.now()}`,
          altText: values.name,
          folder: process.env.NEXT_PUBLIC_BUILDER_IO_PRODUCT_FOLDER_ID,
          file,
        }).then((response) => ({ ...response, index }))
      );

      const uploadedImages = await Promise.all(uploadPromises);

      const finalImages = Array.from({ length: 5 })
        .map((_, index) => {
          const existingImage = values.images?.[index];
          const file = imageFiles[index];

          if (file) {
            const uploadedImage = uploadedImages.find(
              (img) => img.index === index
            );
            return uploadedImage
              ? { url: uploadedImage.url, position: index + 1 }
              : null;
          } else if (existingImage) {
            return existingImage;
          } else {
            return null;
          }
        })
        .filter(Boolean);

      const finalValues = {
        ...values,
        images: finalImages,
      };

      console.log("Submitting form with values:", finalValues);
      await new Promise((resolve) => updateProductById(props?.id, finalValues));

      setImageFiles([]);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
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
      {({ values, errors, touched, setFieldValue }) => (
        <Form className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4">
              <div className="">
                <label className="block text-gray-700 font-medium">
                  Product Name
                </label>
              </div>
              <div className="space-y-2">
                <Field
                  name="name"
                  type="text"
                  className={"w-full h-10 border-2 rounded-md px-3"}
                  placeholder="Product name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex items-center">
                <label className="block text-gray-700 font-medium">Price</label>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                  <span className="font-semibold">Rp</span>
                  <Field
                    name="price"
                    type="number"
                    className={"w-full h-10 border-2 rounded-md px-3"}
                    placeholder="Product price"
                  />
                </div>
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex items-start pt-2">
                <label className="block text-gray-700 font-medium">
                  Description
                </label>
              </div>
              <div className="space-y-2">
                <Field
                  as="textarea"
                  name="description"
                  className={"w-full h-32 border-2 rounded-md p-3"}
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

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-6">Product Images</h2>
            <div className="space-y-4">
              <label className="block text-gray-700 font-medium">
                Upload up to 5 images
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, index) => {
                  const currentImage = values.images?.[index];
                  const previousImage =
                    index > 0 ? values.images?.[index - 1] : true;
                  const isDisabled = !previousImage && index !== 0;

                  return (
                    <ImageUpload
                      key={index}
                      imageUrl={
                        currentImage?.url ||
                        (imageFiles[index]
                          ? URL.createObjectURL(imageFiles[index])
                          : undefined)
                      }
                      disabled={isDisabled}
                      onImageChange={(file) => {
                        if (file === null) {
                        } else {
                          const newImageFiles = [...imageFiles];
                          newImageFiles[index] = file;
                          setImageFiles(newImageFiles);

                          const newImages = [...(values.images || [])];
                          if (file) {
                            if (newImages[index]) {
                              newImages[index] = {
                                ...newImages[index],
                                position: index + 1,
                              };
                            } else {
                              newImages[index] = {
                                url: "",
                                position: index + 1,
                              };
                            }
                          } else {
                            newImages.splice(index, 1);
                          }
                          setFieldValue("images", newImages);
                        }
                      }}
                    />
                  );
                })}
              </div>
              <ErrorMessage
                name="images"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-6">Product Dimensions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {["weight", "height", "width", "length"].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-gray-700 font-medium capitalize">
                    {field} ({field === "weight" ? "kg" : "cm"})
                  </label>
                  <Field
                    name={field}
                    type="number"
                    className={"w-full h-10 border-2 rounded-md px-3"}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
                  <ErrorMessage
                    name={field}
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-6">Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4 items-center">
              <label className="block text-gray-700 font-medium">
                Select Category
              </label>
              <div className="space-y-2">
                <Field
                  name="categoryId"
                  as="select"
                  className={"w-full h-11 border-2 rounded-md px-3"}
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
          </div>

          <div className="grid grid-cols-1">
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "px-6 py-2 rounded-md font-medium text-white transition-colors",
                  isSubmitting
                    ? "bg-gray-800 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
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
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProductFormComponent;
