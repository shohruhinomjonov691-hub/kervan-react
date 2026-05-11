import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { setChosenProduct, setRestaurant } from "./slice";
import { retrieveChosenProduct, retrieveRestaurant } from "./selector";
import { Product } from "../../../lib/types/product";
import { Member } from "../../../lib/types/member";
import { useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";

const actionDispatch = (dispatch: Dispatch) => ({
  setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
  setRestaurant: (data: Member) => dispatch(setRestaurant(data)),
});

const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({ chosenProduct }),
);

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
}

const initialReviews: Review[] = [
  {
    id: 1,
    name: "Min-ho Choi",
    rating: 5,
    text: "The lamb was incredibly tender. It's hard to find such authentic Turkish flavors in Seoul. The saffron rice was the perfect companion. Definitely ordering again!",
    date: "October 24, 2024",
  },
  {
    id: 2,
    name: "Ji-won Kim",
    rating: 5,
    text: "Portion size is generous for the price. The presentation was exquisite — it felt like a luxury dining experience right at home.",
    date: "October 18, 2024",
  },
];

interface ChosenProductProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct(props: ChosenProductProps) {
  const { onAdd } = props;
  const { productId } = useParams<{ productId: string }>();
  const { setChosenProduct, setRestaurant } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const product = new ProductService();
    product
      .getProduct(productId)
      .then((data) => setChosenProduct(data))
      .catch((err) => console.log(err));

    const member = new MemberService();
    member
      .getRestaurant()
      .then((data) => setRestaurant(data))
      .catch((err) => console.log(err));
  }, []); // eslint-disable-line

  if (!chosenProduct) return null;

  const handleAddToBasket = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd({
      _id: chosenProduct._id,
      quantity,
      name: chosenProduct.productName,
      price: chosenProduct.productPrice,
      image: chosenProduct.productImages[0],
    });
    await sweetTopSmallSuccessAlert("Added to basket! 🛍️", 1000);
  };

  const handleSubmitReview = () => {
    if (!reviewName.trim() || !reviewText.trim()) return;
    const newReview: Review = {
      id: Date.now(),
      name: reviewName,
      rating: reviewRating,
      text: reviewText,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
    setReviews([newReview, ...reviews]);
    setReviewName("");
    setReviewText("");
    setReviewRating(5);
  };

  const avgRating = (
    reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="chosen-product">
      <Container maxWidth="lg">
        {/* Breadcrumb */}
        <Box className="cp-breadcrumb">
          <span className="cp-bc-link">MENU</span>
          <span className="cp-bc-sep">›</span>
          <span className="cp-bc-link">{chosenProduct.productCollection}</span>
          <span className="cp-bc-sep">›</span>
          <span className="cp-bc-current">
            {chosenProduct.productName.toUpperCase()}
          </span>
        </Box>

        {/* ══ MAIN LAYOUT ══ */}
        <Stack direction={{ xs: "column", lg: "row" }} gap={6} sx={{ mb: 8 }}>
          {/* ── LEFT: Image sliders ── */}
          <Box className="cp-gallery">
            {/* Main big image */}
            <Box className="cp-main-swiper-wrap">
              {/* Rating badge top-right */}
              <Box className="cp-rating-badge">
                <StarIcon sx={{ fontSize: 14, color: "#8d4b00" }} />
                <span>4.8</span>
              </Box>

              <Swiper
                loop={true}
                spaceBetween={10}
                navigation={true}
                thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                modules={[FreeMode, Navigation, Thumbs]}
                className="cp-main-swiper"
              >
                {chosenProduct.productImages.map((img: string, i: number) => (
                  <SwiperSlide key={i}>
                    <img
                      className="cp-main-img"
                      src={`${serverApi}/${img}`}
                      alt={chosenProduct.productName}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>

            {/* Thumbnails */}
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={12}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="cp-thumb-swiper"
            >
              {chosenProduct.productImages.map((img: string, i: number) => (
                <SwiperSlide key={i}>
                  <Box className="cp-thumb-slide">
                    <img
                      className="cp-thumb-img"
                      src={`${serverApi}/${img}`}
                      alt=""
                    />
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>

          {/* ── RIGHT: Info panel ── */}
          <Box className="cp-info-panel">
            {/* Top row: label + views */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Typography className="cp-heritage-label">
                AUTHENTIC HERITAGE
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                gap={0.5}
                className="cp-views"
              >
                <RemoveRedEyeOutlinedIcon sx={{ fontSize: 14 }} />
                <span>{chosenProduct.productViews} views</span>
              </Stack>
            </Stack>

            {/* Product name */}
            <Typography className="cp-product-name">
              {chosenProduct.productName}
            </Typography>

            {/* Price row */}
            <Stack
              direction="row"
              alignItems="center"
              gap={2}
              sx={{ mt: 1.5, mb: 1.5 }}
            >
              <Typography className="cp-price">
                ₩{chosenProduct.productPrice.toLocaleString()}
              </Typography>
            </Stack>

            {/* Stars */}
            <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 2 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon
                  key={s}
                  sx={{ fontSize: 20, color: s <= 4 ? "#8d4b00" : "#dbc2b0" }}
                />
              ))}
              <Typography
                sx={{
                  fontFamily: "'Be Vietnam Pro',sans-serif",
                  fontSize: "0.875rem",
                  color: "#887364",
                  ml: 0.5,
                }}
              >
                4.8 / 5.0
              </Typography>
            </Stack>

            {/* Description */}
            {chosenProduct.productDesc && (
              <Typography className="cp-desc">
                {chosenProduct.productDesc}
              </Typography>
            )}

            {/* Divider */}
            <Divider sx={{ borderColor: "rgba(219,194,176,0.4)", my: 2.5 }} />
            {/* Quantity + Add to basket */}
            <Stack
              direction="row"
              alignItems="center"
              gap={2}
              sx={{ mt: 2.5, mb: 2 }}
            >
              {/* Qty */}
              <Stack direction="row" alignItems="center" className="cp-qty">
                <button
                  className="cp-qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </button>
                <span className="cp-qty-num">{quantity}</span>
                <button
                  className="cp-qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </button>
              </Stack>

              {/* Add to basket */}
              <Button
                variant="contained"
                fullWidth
                className="cp-add-btn"
                startIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />}
                onClick={handleAddToBasket}
              >
                Add to Basket
              </Button>
            </Stack>

            {/* Delivery info box */}
            <Box className="cp-delivery-box">
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Box className="cp-delivery-icon">🚴</Box>
                <Box>
                  <Typography className="cp-delivery-title">
                    Express Gourmet Delivery
                  </Typography>
                  <Typography className="cp-delivery-sub">
                    Typical arrival in{" "}
                    <strong style={{ color: "#8d4b00" }}>30–45 minutes</strong>{" "}
                    to Gangnam area.
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Stack>

        {/* ══ GUEST EXPERIENCES ══ */}
        <Box className="cp-reviews">
          {/* Header */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ sm: "flex-end" }}
            sx={{ mb: 4 }}
            gap={2}
          >
            <Box>
              <Typography className="cp-reviews-title">
                Guest Experiences
              </Typography>
              <Typography className="cp-reviews-sub">
                Hear from our Seoul community about their authentic dining
                journey with this signature platter.
              </Typography>
            </Box>
            {/* Avg rating box */}
            <Box className="cp-avg-box">
              <Stack direction="row" gap={0.4} sx={{ mb: 0.5 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} sx={{ fontSize: 16, color: "#8d4b00" }} />
                ))}
              </Stack>
              <Typography className="cp-avg-num">{avgRating} / 5.0</Typography>
            </Box>
          </Stack>

          {/* Review cards */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            gap={3}
            flexWrap="wrap"
            sx={{ mb: 5 }}
          >
            {reviews.map((review) => (
              <Box key={review.id} className="cp-review-card">
                {/* Reviewer header */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  sx={{ mb: 1.5 }}
                >
                  <Stack direction="row" gap={1.5} alignItems="center">
                    <Box className="cp-review-avatar">
                      {review.name.charAt(0)}
                    </Box>
                    <Box>
                      <Typography className="cp-review-name">
                        {review.name}
                      </Typography>
                      <Stack direction="row" gap={0.3} sx={{ mt: 0.3 }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <StarIcon
                            key={s}
                            sx={{
                              fontSize: 13,
                              color: s <= review.rating ? "#8d4b00" : "#e8d9cc",
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                  <Chip
                    label="VERIFIED GUEST"
                    size="small"
                    className="cp-verified-chip"
                  />
                </Stack>

                {/* Review text */}
                <Typography className="cp-review-text">
                  "{review.text}"
                </Typography>
                <Typography className="cp-review-date">
                  {review.date}
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* Write Review form */}
          <Box className="cp-write-review">
            <Typography className="cp-write-title">Write a Review</Typography>

            {/* Star picker */}
            <Stack direction="row" gap={0.5} sx={{ mb: 2.5, mt: 1.5 }}>
              {[1, 2, 3, 4, 5].map((s) => {
                const filled = s <= (hoverRating || reviewRating);
                return filled ? (
                  <StarIcon
                    key={s}
                    className="cp-star-pick"
                    onClick={() => setReviewRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    sx={{ fontSize: 30, color: "#8d4b00", cursor: "pointer" }}
                  />
                ) : (
                  <StarBorderIcon
                    key={s}
                    className="cp-star-pick"
                    onClick={() => setReviewRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    sx={{ fontSize: 30, color: "#dbc2b0", cursor: "pointer" }}
                  />
                );
              })}
            </Stack>

            <Stack gap={2}>
              <TextField
                fullWidth
                size="small"
                label="Your Name"
                value={reviewName}
                onChange={(e: T) => setReviewName(e.target.value)}
                sx={fieldSx}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Share your experience..."
                value={reviewText}
                onChange={(e: T) => setReviewText(e.target.value)}
                sx={fieldSx}
              />
              <Button
                variant="contained"
                className="cp-submit-btn"
                onClick={handleSubmitReview}
                sx={{ alignSelf: "flex-start" }}
              >
                Post Review
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.625rem",
    fontFamily: "'Be Vietnam Pro', sans-serif",
    background: "#fff",
    "& fieldset": { borderColor: "#e8d9cc" },
    "&:hover fieldset": { borderColor: "#8d4b00" },
    "&.Mui-focused fieldset": { borderColor: "#8d4b00", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "'Be Vietnam Pro', sans-serif",
    color: "#a08070",
    "&.Mui-focused": { color: "#8d4b00" },
  },
};
