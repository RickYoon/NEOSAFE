// 자식 컴포넌트 ChildComponent.js
import React from 'react';

const LoadingCreate = () => {
  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="relative w-full max-w-md max-h-full">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          {/* 이 부분에 원하는 내용 추가 */}
          <div className="mt-20">
            {/* 여기에 추가할 내용을 넣으세요 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCreate;