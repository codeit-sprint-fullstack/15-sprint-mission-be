import heartIcon from "../../../assets/images/icons/ic_heart.svg";
import "./ItemCard.css";
import { useState } from "react";

function ItemCard({ item }) {
  const [hasImageError, setHasImageError] = useState(false);
  const imageUrl = item.images?.[0];
  const canShowImage = imageUrl && !hasImageError;

  return (
    <article className="item-card">
      {/* {imageUrl ? (
        <img src={imageUrl} alt={item.name} className="item-card-image" />
      ) : (
        <div className="item-card-image item-card-image-placeholder">
          이미지 준비 중
        </div>
      )} */}

      {canShowImage ? (
        <img
          src={imageUrl}
          alt={item.name}
          className="item-card-image"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <div className="item-card-image item-card-image-placeholder">
          이미지 준비중
        </div>
      )}

      <div className="item-card-content">
        <h2 className="item-card-name">{item.name}</h2>

        <p className="item-card-price">
          {item.price.toLocaleString("ko-KR")}원
        </p>

        <div className="item-card-favorite">
          <img
            src={heartIcon}
            alt=""
            aria-hidden="true"
            className="item-card-heart"
          />
          <span>{item.favoriteCount}</span>
        </div>
      </div>
    </article>
  );
}

export default ItemCard;
