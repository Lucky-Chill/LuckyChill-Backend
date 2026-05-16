import { getClassroomImageUrl } from '../../../utils/classroomImage';
import ClassroomCard from './ClassroomCard';
import FloorTabs from './FloorTabs';
import useHomeClassrooms from '../hooks/useHomeClassrooms';

function HomeContent() {
  const { activeFloor, classrooms, setActiveFloor, handleClassroomClick } = useHomeClassrooms();

  return (
    <section className='pt-12 pb-16'>
      <h1 className='m-0 text-base leading-6 font-bold tracking-normal text-[#111827]'>
        강의실 예약
      </h1>

      <div className='mt-14'>
        <FloorTabs activeFloor={activeFloor} onFloorChange={setActiveFloor} />
      </div>

      <div className='mt-7 min-h-[536px] pt-10'>
        <div className='grid grid-cols-[repeat(5,200px)] justify-between gap-y-10'>
          {classrooms.map((classroom) => (
            <ClassroomCard
              key={classroom.id}
              roomName={classroom.roomName}
              capacity={classroom.capacity}
              imageUrl={getClassroomImageUrl(classroom.id)}
              onClick={() => handleClassroomClick(classroom)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeContent;
