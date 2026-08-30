import "./RegistrationPage.css";
import { useState } from "react";
import { createProduct } from "../../api/productApi.js";
import { useNavigate } from "react-router"; //코드에서 URL을이동하는 hook
import useProductFormValidation from "../../hooks/useProductFormValidation.js";
import xIcon from "../../assets/images/icons/ic_x.svg";

// 상품 등록 화면을 담당하는 페이지 컴포넌트
function RegistrationPage() {
  const navgate = useNavigate(); //상품 등록 성공 후 상세 페이지로 이동

  const [name, setName] = useState(""); //사용자가 입력한 상품명을 저장

  const [description, setDescription] = useState(""); //사용자가 입력한 상품 소개를 저장

  const [price, setPrice] = useState(""); //사용자가 입력한 판매가격을 문자열로 저장

  const [tagInput, setTagInput] = useState(""); //태그 입력창에 작성 중인 글자를 저장

  const [tags, setTags] = useState([]); //Enter로 입력이 완료된 태그들을 배열로 저장

  const { nameError, descriptionError, priceError, tagError } =
    useProductFormValidation({
      name,
      description,
      price,
      tags,
      tagInput
    }); //현재 상품명이 유효한지 검사

  const [isNameTouched, setIsNameTouched] = useState(false); //상품명 입력을 마쳤는지 저장

  const [hasDescriptionChanged, setHasDescriptionChanged] = useState(false); //상품소개 입력했는지 글자수유효성 검사
  const [isDescriptionTouched, setIsDescriptionTouched] = useState(false); //상품소개 입력했는지 내용비어있으면true

  const [hasPriceChanged, setHasPriceChanged] = useState(false); //판매 가격이 변경됐는지 저장
  const [isPriceTouched, setIsPriceTouched] = useState(false); // 판매 가격 입력창에서 포커스가 빠졌는지저장

  const [hasTagChanged, setHasTagChaged] = useState(false) //태그 입력값이 변경됐는지 저장
  const [isTagTouched, setIsTagTouched] = useState(false) //태그 입력창에서 포커스가 빠졌는지 저장

  const shouldShowNameError =
    Boolean(nameError) && (isNameTouched || name.trim().length > 10); //입력을 마쳤거나 상품명이 10자를 넘으면 오류를 바로 표시

  // 첫 입력 이후 유효하지 않으면 최소·최대 글자 수 오류를 즉시 표시
  const shouldShowDescriptionError =
    (hasDescriptionChanged || isDescriptionTouched) &&
    Boolean(descriptionError);

  //판매가격 : 가격을 입력했거나 입력창을 벗어난 뒤 오류가 있으면 표시
  const shouldShowPriceError =
    (hasPriceChanged || isPriceTouched) && Boolean(priceError);

  //태그 : 태그를 입력했거나 입력창을 벗어난 뒤 오류가 있으면 표시;
  const shouldShowTagError =
    (hasTagChanged || isTagTouched) && Boolean(tagError);

  //등록버튼 조건 : 첫입력 이후 유효하지 않으면 최소최대 글자 수 오류를 즉시표시
  const isFormComplete =
    nameError === "" &&
    descriptionError === "" &&
    priceError === "" &&
    tagError === "" &&
    tags.length > 0;

// Enter를 누르면 유효한 태그만 배열에 추가
const handleTagKeyDown = (event) => {
  // 한글 조합 중이거나 Enter가 아니면 실행하지 않음
  if (event.nativeEvent.isComposing || event.key !== "Enter") {
    return;
  }

  // Enter로 폼 전체가 제출되는 것을 방지
  event.preventDefault();

  // 태그 앞뒤의 불필요한 공백을 제거
  const newTag = tagInput.trim();

  // 빈 문자열은 태그로 추가하지 않음
  if (!newTag) {
    return;
  }

  // 5글자를 초과한 태그는 칩으로 추가하지 않음
  if (newTag.length > 5) {
    return;
  }

  // 유효한 태그를 기존 배열 뒤에 추가
  setTags([...tags, newTag]);

  // 추가가 끝나면 태그 입력창을 비움
  setTagInput("");
};

  //클릭한 순서의 태그만 배열에서 제거
  const handleRemoveTag = (targetIndex) => {
    setTags((currentTags)=>
      currentTags.filter((_, index)=> index !== targetIndex),
    )
  }

  //등록버튼을 눌렀을 떄 폼 제출을 REACT에서 처리
  const handleSubmit = async (event) => {
    //브라우저의 기본 새로고침 동작을 방지
    event.preventDefault();
    //백앤드 post api에 전달할 상품 데이터
    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      tags,
    };

    try {
      //post 요청이 끝날 때까지 기다린 뒤 생성 상품을 받음
      const createdProduct = await createProduct(productData);
      //API 연결 확인을 위한 임시 성공 로그
      // console.log("상품 등록 성공:", createdProduct)
      navgate(`/items/${createdProduct.id}`); //서버가 반환한 상품 ID의 상세 빈 페이지로 이동
    } catch (error) {
      //서버 오류나 네트워크 오류를 console에서 확인
      console.error("상품 등록 실패:", error);
      // API 연결 전에 상품 데이터의 형식을 임시확인
    }
  };

  return (
    <main className="registration-page">
      {/* 폼 제출 시 handleSubmit 함수를 실행 */}
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="registration-form-header">
          <h1 className="registration-page-title">상품 등록하기</h1>

          <button
            className="registration-submit-button"
            type="submit"
            disabled={!isFormComplete}
          >
            등록
          </button>
        </div>

        {/* 상품 입력 항목을 세로로 배치하는 영역 */}
        <div className="registration-fields">
          <div className="registration-field">
            <label className="registration-field-label" htmlFor="product-name">
              상품명
            </label>
            {/* 입력값을 name state와 연결 */}
            {/* 상품명 입력창과 오류 메시지를 8px 간격으로 배치 */}
            <div className="registration-input-group">
              <input
                className={`registration-field-input ${
                  shouldShowNameError ? "registration-field-input-error" : ""
                }`}
                id="product-name"
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                // 입력창을 벗어나면 상품명 오류를 표시
                onBlur={() => {
                  setIsNameTouched(true);
                }}
                placeholder="상품명을 입력해주세요"
              />

              {/* 표시 조건을 만족할 때만 상품명 오류 메시지 출력 */}
              {shouldShowNameError ? (
                <p className="registration-field-error-message">{nameError}</p>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* 상품에 대한 자세한 소개를 입력받는 항목 */}
          <div className="registration-field">
            <label
              className="registration-field-label"
              htmlFor="product-description"
            >
              상품 소개
            </label>

            {/* 공통 입력창 스타일과 textarea 전용 높이를 함께 적용 */}
            <div className="registration-input-group">
              <textarea
                className={`registration-field-input registration-field-textarea ${
                  shouldShowDescriptionError
                    ? "registration-field-input-error"
                    : ""
                }`}
                id="product-description"
                name="description"
                value={description}
                onChange={(event) => {
                  // 입력한 상품 소개를 state에 저장
                  setDescription(event.target.value);

                  // 사용자가 상품 소개를 입력했음을 저장
                  setHasDescriptionChanged(true);
                }}
                /* 입력창을 벗어나면 touched 상태로 변경 */
                onBlur={() => setIsDescriptionTouched(true)}
                placeholder="상품 소개를 입력해주세요"
              />
              {/* 최소 또는 최대 글자 수 오류를 즉시표시 */}
              {shouldShowDescriptionError ? (
                <p className="registration-field-error-message">
                  {descriptionError}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* 상품의 판매 가격을 입력받는 항목 */}
          <div className="registration-field">
            <label className="registration-field-label" htmlFor="product-price">
              판매가격
            </label>
            <div className="registration-input-group">
              <input
                className={`registration-field-input ${
                  shouldShowPriceError ? "registration-field-input-error" : ""
                }`}
                id="product-price"
                name="price"
                type="text"
                inputMode="numeric"
                value={price}
                onChange={(event) => {
                  setPrice(event.target.value);
                  setHasPriceChanged(true);
                }}
                /* 가격 입력창을 벗어났음을 저장 */
                onBlur={() => setIsPriceTouched(true)}
                placeholder="판매 가격을 입력해주세요"
              />

              {/* 판매 가격 오류가 있을 때만 메시지를 표시 */}
              {shouldShowPriceError ? (
                <p className="registration-field-error-message">{priceError}</p>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* 상품을 분류할 태그를 입력받는 항목 */}
          <div className="registration-field">
            <label className="registration-field-label" htmlFor="product-tag">
              태그
            </label>

            {/* 저장된 태그가 있을 떄만 칩 목록을 표시 */}
            {/* 태그 입력창과 오류 메시지를 8px 간격으로 배치 */}
            <div className="registration-tag-input-area">
              <div className="registration-input-group">
                <input
                  className={`registration-field-input ${
                    shouldShowTagError
                      ? "registration-field-input-error"
                      : ""
                  }`}
                  id="product-tag"
                  name="tag"
                  type="text"
                  value={tagInput}
                  // 입력하는 순간부터 태그 글자 수를 검사
                  onChange={(event)=>{
                    setTagInput(event.target.value);
                    setHasTagChaged(true)
                  }}
                  onKeyDown={handleTagKeyDown}
                  //빈 상태로 입력창을 벗어나도 오류를 표시
                  onBlur={()=>setIsTagTouched(true)}
                  placeholder="태그를 입력해주세요"
                  />

                  {/* 태그 오류가 있을때만 메시지 표시 */}
                  {shouldShowTagError? (
                    <p className="registration-field-error-message">{tagError}</p>
                  ) : ""}
              </div>
              {/* 저장된 태그가 있을 때만 칩 목록을 표시 */}
              {tags.length > 0 && (
                <div className="registration-tag-list">
                  {/* tags 배열의 각 값을 태그 칩으로 변환 */}
                  {tags.map((tag, index) => (
                    <div className="registration-tag-chip" key={`${tag}-${index}`}>
                      <span>#{tag}</span>

                    {/* type="button"으로 설정해 폼 제출을 방지 */}
                    <button
                      className="registration-tag-remove-button"
                      type="button"
                      onClick={()=>handleRemoveTag(index)}
                      aria-label={`${tag} 태그 삭제`}>

                      <img
                        className="registration-tag-remove-icon"
                        src={xIcon}
                        alt="" />
                    </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

export default RegistrationPage;
