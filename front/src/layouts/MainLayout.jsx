/**
 * 메인 레이아웃 컴포넌트
 * @description Header + Content 영역으로 구성된 공통 레이아웃입니다.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content 영역에 렌더링할 자식 컴포넌트
 */
import Header from '../components/common/Header';

const MainLayout = ({ children }) => {
  return (
    <div className='flex h-screen w-full flex-col bg-primary-white'>
      <Header />
      <main className='flex-1 overflow-y-auto bg-primary-white'>
        <div className='mx-auto h-full w-full max-w-[1200px] px-5 xl:px-0'>{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
