//상품 등록 폼의 유효성 검사 결과를 반환하는 Custom hook
export default function useProductFormValidation({
  name,
  description,
  price,
  tags,
  tagInput,
}) {
  const trimmedName = name.trim(); //앞뒤 공백을 제외한 상품명
  const trimmedDescription = description.trim(); // 상품 소개 앞 뒤의 불필요한 공백을 제거
  const trimmedPrice = price.trim(); // 상품 소개 앞 뒤의 불필요한 공백을 제거
  const trimmedTag = tagInput.trim(); // 현재 작성 중인 태그의 앞 뒤 공백을 제거

  let nameError = "";

  //상품명은 1자 이상이어야 함.
  if (trimmedName.length === 0) {
    nameError = "상품명을 입력해주세요";
  } else if (trimmedName.length > 10) {
    //상품명은 10자를 넘을 수 없음
    nameError = "10자 이내로 입력해주세요";
  }

  let descriptionError = "";

  //상품 소개는 10자 이상 100자 이하여야 함
  if (trimmedDescription.length < 10) {
    descriptionError = "10자 이상 입력해주세요";
  } else if (trimmedDescription.length > 100) {
    descriptionError = "100자 이내로 입력해주세요";
  }

  //판매 가격은 비어있지 않아야하고 숫자만 입력할 수 있음
  let priceError = "";

  if (trimmedPrice.length === 0) {
    priceError = "판매 가격을 입력해주세요";
  } else if (!/^\d+$/.test(trimmedPrice)) {
    priceError = "숫자로 입력해주세요";
  }

  // 작성 중이거나 저장된 태그는 각각 5글자를 넘을 수 없음
  let tagError = "";
  const hasLongTag =
    trimmedTag.length > 5 ||
    tags.some((tag) =>
      tag.trim().length > 5);

      if(hasLongTag) {
        tagError = "5글자 이내로 입력해주세요"
      }else if (trimmedTag.length === 0 && tags.length === 0) {
        //작성 중인 태그와 저장된 태그가 모두 없으면 필수값 오류
        tagError = "태그를 추가해주세요"
      }


  return {
    nameError,
    descriptionError,
    priceError,
    tagError,
  };
}
