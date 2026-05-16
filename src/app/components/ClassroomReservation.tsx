import { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';

interface Reservation {
  roomNumber: string;
  date: string;
  time: string;
}

interface ClassroomReservationProps {
  onConfirmReservation: (reservations: Reservation[]) => void | Promise<void>;
  existingReservations: Reservation[];
}

export default function ClassroomReservation({
  onConfirmReservation,
  existingReservations,
}: ClassroomReservationProps) {
  const [selectedFloor, setSelectedFloor] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('2026-05-16');
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [firstSelectedTime, setFirstSelectedTime] = useState<string | null>(null);

  const floors = [2, 3, 4, 5, 6, 7];
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const getRoomsForFloor = (floor: number) => {
    return Array.from({ length: 10 }, (_, i) => `${floor}${(i + 1).toString().padStart(2, '0')}`);
  };

  const isReserved = (roomNumber: string, time: string, date: string) => {
    return existingReservations.some(
      r => r.roomNumber === roomNumber && r.time === time && r.date === date
    );
  };

  const handleTimeSelect = (time: string) => {
    if (!firstSelectedTime) {
      // 첫 번째 시간 선택
      setFirstSelectedTime(time);
      setSelectedTimes([time]);
    } else {
      // 두 번째 시간 선택 - 범위 선택
      const firstIndex = timeSlots.indexOf(firstSelectedTime);
      const secondIndex = timeSlots.indexOf(time);

      const startIndex = Math.min(firstIndex, secondIndex);
      const endIndex = Math.max(firstIndex, secondIndex);

      const rangeSelected = timeSlots.slice(startIndex, endIndex + 1);
      setSelectedTimes(rangeSelected);
      setFirstSelectedTime(null);
    }
  };

  const handleDateSelect = (day: number) => {
    if (day < 1 || day > 31) return;
    const newDate = `2026-05-${day.toString().padStart(2, '0')}`;
    setSelectedDate(newDate);
    setSelectedTimes([]);
    setFirstSelectedTime(null);
  };

  const handleConfirmReservation = async () => {
    if (!selectedRoom || selectedTimes.length === 0) {
      alert('시간을 선택해주세요.');
      return;
    }

    const newReservations = selectedTimes.map(time => ({
      roomNumber: selectedRoom,
      date: selectedDate,
      time,
    }));

    try {
      await onConfirmReservation(newReservations);
      alert(`예약이 완료되었습니다!\n${selectedDate}\n${selectedTimes.join(', ')}`);
      setSelectedRoom(null);
      setSelectedTimes([]);
      setFirstSelectedTime(null);
    } catch {
      alert('예약 저장에 실패했습니다. Firestore 규칙을 확인해주세요.');
    }
  };

  return (
    <div>
      {/* 층수 네비게이션 */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="flex gap-2 p-4">
          {floors.map((floor) => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedFloor === floor
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {floor}F
            </button>
          ))}
        </div>
      </div>

      {/* 강의실 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {getRoomsForFloor(selectedFloor).map((room) => (
          <div
            key={room}
            onClick={() => setSelectedRoom(room)}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          >
            {/* 강의실 이미지 */}
            <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <img
                src={`https://images.unsplash.com/photo-1577896851905-dc72dc5291f4?w=400&h=300&fit=crop&q=80`}
                alt={`강의실 ${room}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 강의실 정보 */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">강의실 {room}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>수용 인원: 30명</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 강의실 상세 및 예약 모달 */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">강의실 {selectedRoom} 예약</h3>
              <button
                onClick={() => setSelectedRoom(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* 강의실 이미지 */}
              <div className="mb-6">
                <img
                  src={`https://images.unsplash.com/photo-1577896851905-dc72dc5291f4?w=800&h=400&fit=crop&q=80`}
                  alt={`강의실 ${selectedRoom}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* 강의실 정보 */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">강의실 정보</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>위치: {selectedFloor}층</div>
                  <div>수용 인원: 30명</div>
                  <div>장비: 빔프로젝터, 화이트보드</div>
                  <div>좌석 형태: 스쿨형</div>
                </div>
              </div>

              {/* 날짜 선택 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  날짜 선택
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <p className="text-lg font-semibold text-gray-900">2026년 5월</p>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                      <div key={i} className="text-center text-sm font-medium text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 35 }, (_, i) => {
                      const date = i - 3 + 1;
                      const isToday = date === 16;
                      const dateStr = `2026-05-${date.toString().padStart(2, '0')}`;
                      const isSelected = selectedDate === dateStr;
                      return (
                        <button
                          key={i}
                          onClick={() => handleDateSelect(date)}
                          disabled={date < 1 || date > 31}
                          className={`py-2 text-center text-sm rounded-md transition-colors ${
                            date < 1 || date > 31
                              ? 'text-gray-300 cursor-default'
                              : isSelected
                              ? 'bg-purple-500 text-white font-semibold'
                              : isToday
                              ? 'bg-yellow-400 text-white font-semibold'
                              : 'hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {date > 0 && date <= 31 ? date : ''}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      <span className="text-gray-600">예약가능</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                      <span className="text-gray-600">오늘</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span className="text-gray-600">선택</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 시간 선택 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  시간 선택
                </h4>
                <div className="text-right mb-2 text-sm text-purple-600 font-medium">
                  {selectedTimes.length > 0
                    ? `${selectedTimes[0]} - ${selectedTimes[selectedTimes.length - 1]} 선택됨`
                    : '시작 시간과 종료 시간을 클릭하세요'}
                </div>
                <div className="grid grid-cols-14 gap-0 border border-gray-300 rounded-lg overflow-hidden">
                  {timeSlots.map((time) => {
                    const isSelected = selectedTimes.includes(time);
                    const alreadyReserved = selectedRoom && isReserved(selectedRoom, time, selectedDate);
                    return (
                      <button
                        key={time}
                        onClick={() => !alreadyReserved && handleTimeSelect(time)}
                        disabled={!!alreadyReserved}
                        className={`relative py-8 text-center transition-colors border-r border-gray-300 last:border-r-0 ${
                          alreadyReserved
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : isSelected
                            ? 'bg-purple-500 text-white font-semibold'
                            : 'bg-yellow-100 hover:bg-yellow-200 text-gray-700'
                        }`}
                      >
                        <div className="text-xs mb-1">{time.split(':')[0]}</div>
                        <div className="text-[10px]">10,000</div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                    <span className="text-gray-600">예약가능</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-gray-600">선택됨</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span className="text-gray-600">예약불가</span>
                  </div>
                </div>
              </div>

              {/* 예약 버튼 */}
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmReservation}
                  disabled={selectedTimes.length === 0}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  예약하기
                </button>
                <button
                  onClick={() => {
                    setSelectedRoom(null);
                    setSelectedTimes([]);
                    setFirstSelectedTime(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
