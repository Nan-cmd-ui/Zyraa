"use client";
import React, { Suspense, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "next/navigation";
import SellerAuthWrapper from "@/components/SellerAuthPaper";
import Navbar from "@/components/Navbar";

const AddProduct = () => {
  const [showOfferPrice, setShowOfferPrice] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [otherImages, setOtherImages] = useState([null]);
  const [videos, setVideos] = useState([null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const params = useParams();

  const uploadFile = async (file, folder) => {
    if (!file) return null;

    // ✅ File size limit check (50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error(`${file.name} is too large (max 50MB)`);
      return null;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage.from("shop-assets").upload(filePath, file, {
      contentType: file.type,
      cacheControl: "3600",
    });

    if (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }

    const { data } = supabase.storage.from("shop-assets").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const mainImageUrl = mainImage ? await uploadFile(mainImage, "products/main_image") : null;
      const otherImagesUrls = await Promise.all(
        otherImages.filter(Boolean).map((f) => uploadFile(f, "products/images"))
      );
      const videoUrls = await Promise.all(
        videos.filter(Boolean).map((f) => uploadFile(f, "products/videos"))
      );

      const { error } = await supabase.from("products").insert([
        {
          name,
          description,
          price: parseFloat(price),
          offer_price: offerPrice ? parseFloat(offerPrice) : null,
          main_image: mainImageUrl,
          images: otherImagesUrls,
          videos: videoUrls,
          created_at: new Date(),
          stock: parseInt(stock, 10),
          promo: null,
          free_shipping: false,
        },
      ]);

      if (error) throw error;

      toast.success("Product added successfully!");
      resetForm();
    } catch (err) {
      console.error("Add product error:", err);
      toast.error(err?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMainImage(null);
    setOtherImages([null]);
    setVideos([null]);
    setName("");
    setDescription("");
    setPrice("");
    setOfferPrice("");
    setStock("");
    setShowOfferPrice(false);
    setCarouselIndex(0);
  };

  const renderUploadSlot = (file, onChange, placeholder = "Click to upload", isVideo = false) => (
    <div className="relative w-24 h-24 border border-gray-300 rounded flex items-center justify-center cursor-pointer overflow-hidden bg-gray-100">
      <input type="file" hidden onChange={onChange} accept={isVideo ? "video/*" : "image/*"} />
      {file ? (
        isVideo ? (
          <video className="w-full h-full object-cover" src={URL.createObjectURL(file)} controls />
        ) : (
          <Image src={URL.createObjectURL(file)} alt="Preview" fill className="object-cover" />
        )
      ) : (
        <span className="text-gray-400 text-xs text-center px-1">{placeholder}</span>
      )}
    </div>
  );

  const carouselMedia = [
    mainImage ? { type: "image", file: mainImage, label: "Main" } : null,
    ...otherImages.filter(Boolean).map((f) => ({ type: "image", file: f })),
    ...videos.filter(Boolean).map((f) => ({ type: "video", file: f })),
  ].filter(Boolean);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SellerAuthWrapper>
        <Navbar />
        <Toaster position="top-right" />
        <div className="flex-1 min-h-screen flex flex-col md:flex-row justify-center items-start md:items-center gap-10 p-4 relative">
          {loading && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg">Uploading...</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="md:w-1/2 w-full space-y-5">
            {/* Product Name */}
            <div>
              <label className="text-base font-medium">Product Name</label>
              <input
                type="text"
                placeholder="Type here"
                className="outline-none py-2 px-3 rounded border border-gray-500/40 w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-base font-medium">Product Description</label>
              <textarea
                rows={4}
                placeholder="Type here"
                className="outline-none py-2 px-3 rounded border border-gray-500/40 w-full resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="text-base font-medium">Quantity Available</label>
              <input
                type="number"
                placeholder="Enter quantity available"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="outline-none py-2 px-3 rounded border border-gray-500/40 w-full"
                required
              />
            </div>

            {/* Main Image */}
            <div>
              <label className="text-base font-medium">Main Image</label>
              <label className="block mt-2 cursor-pointer">
                {renderUploadSlot(mainImage, (e) => setMainImage(e.target.files[0]))}
              </label>
            </div>

            {/* Other Images */}
            <div>
              <label className="text-base font-medium">Other Images</label>
              <div className="flex flex-wrap gap-3 mt-2">
                {otherImages.map((file, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <label>
                      {renderUploadSlot(file, (e) => {
                        const copy = [...otherImages];
                        copy[i] = e.target.files[0];
                        setOtherImages(copy);
                      })}
                    </label>
                    {otherImages.length > 1 && (
                      <button
                        type="button"
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                        onClick={() => setOtherImages(otherImages.filter((_, idx) => idx !== i))}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {otherImages.length < 5 && (
                  <button
                    type="button"
                    className="px-3 py-1 bg-gray-200 text-sm rounded w-24 h-24 flex items-center justify-center"
                    onClick={() => setOtherImages([...otherImages, null])}
                  >
                    + Add
                  </button>
                )}
              </div>
            </div>

            {/* Videos */}
            <div>
              <label className="text-base font-medium">Videos</label>
              <div className="flex flex-wrap gap-3 mt-2">
                {videos.map((file, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <label>
                      {renderUploadSlot(
                        file,
                        (e) => {
                          const copy = [...videos];
                          copy[i] = e.target.files[0];
                          setVideos(copy);
                        },
                        "Click to upload video",
                        true
                      )}
                    </label>
                    {videos.length > 1 && (
                      <button
                        type="button"
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                        onClick={() => setVideos(videos.filter((_, idx) => idx !== i))}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {videos.length < 3 && (
                  <button
                    type="button"
                    className="px-3 py-1 bg-gray-200 text-sm rounded w-24 h-24 flex items-center justify-center"
                    onClick={() => setVideos([...videos, null])}
                  >
                    + Add
                  </button>
                )}
              </div>
            </div>

            {/* Price & Discount */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex flex-col w-32">
                <label>Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                  <input
                    type="number"
                    className="outline-none py-2 pl-6 pr-3 rounded border border-gray-500/40 w-full"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  className="px-3 py-1 text-sm"
                  onClick={() => setShowOfferPrice(!showOfferPrice)}
                >
                  {showOfferPrice ? "Remove" : "Add Discount Price"}
                </button>
              </div>

              {showOfferPrice && (
                <div className="flex flex-col w-32">
                  <label>Discount Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                    <input
                      type="number"
                      className="outline-none py-2 pl-6 pr-3 rounded border border-gray-500/40 w-full"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
              disabled={loading}
            >
              {loading ? "Uploading..." : "ADD PRODUCT"}
            </button>
          </form>
        </div>
      </SellerAuthWrapper>
    </Suspense>
  );
};

export default AddProduct;
