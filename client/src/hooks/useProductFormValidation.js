//상품 등록 폼의 유효성 검사 결과를 반환하는 Custom hook
export default function useProductFormValidation({ name, description }) {
  const trimmedName = name.trim(); //앞뒤 공백을 제외한 상품명
  const trimmedDescription = description.trim(); // 상품 소개 앞 뒤의 불필요한 공백을 제거

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

  return {
    nameError,
    descriptionError,
  };
}
