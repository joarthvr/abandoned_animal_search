import key from "./key.js";
const { API_KEY } = key;
const BASE_URL = "https://apis.data.go.kr/1543061/abandonmentPublicSrvc";
// import { renderPublics } from "./app.js";

//데이터 가져오기
export const fetchData = async (endpoint, params) => {
  try {
    const url = new URL(`${BASE_URL}/${endpoint}`);
    url.search = new URLSearchParams({
      serviceKey: API_KEY,
      _type: "json",
      ...params,
    });
    // console.log("Fetching URL:", url.toString()); // 디버깅을 위한 URL 출력
    const response = await fetch(url);
    // HTTP 오류 처리
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // JSON으로 변환
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// 시도 정보 가져오기
export const getCity = async () => {
  try {
    const data = await fetchData("sido", { numOfRows: 10, pageNo: 1 });
    if (!data.response?.body?.items?.item) {
      throw new Error("시도 정보를 가져오는데 실패했습니다.");
    }

    return data.response.body.items.item;
  } catch (error) {
    console.error("시도 정보 조회 중 오류 발생:", error);
    throw error; // 오류를 상위로 전파
  }
};

// 시군구 정보 가져오기
export const getDistrict = async (uprCd) => {
  const data = await fetchData("sigungu", { upr_cd: uprCd });
  if (!data.response?.body?.items?.item) {
    throw new Error("시군구 정보를 가져오는데 실패했습니다.");
  }
  return data.response.body.items.item;
};

// 품종 정보 가져오기
export const getKind = async (kind) => {
  console.log("kind:", kind);
  const dogOrCat = kind === "dog" ? 417000 : 422400;
  const data = await fetchData("kind", { up_kind_cd: dogOrCat });
  if (!data.response?.body?.items?.item) {
    throw new Error("품종 정보를 가져오는데 실패했습니다.");
  }
  return data.response.body.items.item;
};

// 보호소 정보 가져오기
export const getShelter = async (uprCd, orgCd) => {
  const data = await fetchData("shelter", { upr_cd: uprCd, org_cd: orgCd });
  if (!data.response.body.items.item) {
    alert("보호소가 없습니다.");
  }
  return data.response.body.items.item;
};

// export const getPublic = async (params) => {
//   const { ...otherParams } = params;
//   // const upkindCode = upkind === "dog" ? 417000 : 422400;
//   const data = await fetchData("abandonmentPublic", {
//     // upkind: upkindCode,
//     ...otherParams,
//   });
//    console.log("data:", data.response.body.items.item[0].noticeEdt);
//   if (!data.response?.body?.items?.item) {
//     alert("해당 조건의 유기동물이 없습니다.");
//   }
//   return data.response.body.items.item;
// };

//오늘 날짜 함수
export const todayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  return `${year}${month}${day}`;
}

//오늘 날짜에서 10일 전 날짜 구하는 함수
export const tenDaysAgo = ()=> {
  const today = new Date();
  const tenDaysAgo = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000);
  
  const year = tenDaysAgo.getFullYear();
  const month = String(tenDaysAgo.getMonth() + 1).padStart(2, '0');
  const day = String(tenDaysAgo.getDate()).padStart(2, '0');
  
  return `${year}${month}${day}`;
}
