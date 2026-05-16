import { Calendar, Clock, X, MapPin } from 'lucide-react';

interface Reservation {
  roomNumber: string;
  date: string;
  time: string;
}

interface MyReservationsProps {
  reservations: Reservation[];
  userEmail: string;
  onClose: () => void;
  onCancelReservation: (roomNumber: string, date: string, times: string[]) => void | Promise<void>;
}

export default function MyReservations({ reservations, userEmail, onClose, onCancelReservation }: MyReservationsProps) {
  // 날짜별로 그룹화
  const groupedReservations = reservations.reduce((acc, reservation) => {
    if (!acc[reservation.date]) {
      acc[reservation.date] = {};
    }
    if (!acc[reservation.date][reservation.roomNumber]) {
      acc[reservation.date][reservation.roomNumber] = [];
    }
    acc[reservation.date][reservation.roomNumber].push(reservation.time);
    return acc;
  }, {} as Record<string, Record<string, string[]>>);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${year}년 ${month}월 ${day}일`;
  };

  const formatTimeRange = (times: string[]) => {
    if (times.length === 1) {
      return times[0];
    }
    const sorted = times.sort();
    return `${sorted[0]} - ${sorted[sorted.length - 1]}`;
  };

  const handleCancelReservation = async (date: string, roomNumber: string) => {
    if (confirm(`${roomNumber} 강의실의 ${formatDate(date)} 예약을 취소하시겠습니까?`)) {
      const timesToCancel = groupedReservations[date][roomNumber];
      await onCancelReservation(roomNumber, date, timesToCancel);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-lg font-semibold">나의 예약 현황</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* 사용자 정보 */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">예약자 정보</p>
            <p className="font-medium text-gray-900">{userEmail}</p>
          </div>

          {/* 예약 목록 */}
          {Object.keys(groupedReservations).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(groupedReservations)
                .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                .map(([date, rooms]) => (
                  <div key={date} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="font-semibold text-gray-900">{formatDate(date)}</span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {Object.entries(rooms).map(([roomNumber, times]) => (
                        <div key={roomNumber} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-red-500" />
                                <h4 className="font-semibold text-gray-900">
                                  강의실 {roomNumber}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>{formatTimeRange(times)}</span>
                                <span className="text-gray-400">|</span>
                                <span>{times.length}시간</span>
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                위치: {roomNumber[0]}층
                              </div>
                            </div>
                            <button
                              onClick={() => handleCancelReservation(date, roomNumber)}
                              className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                              예약 취소
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">예약 내역이 없습니다.</p>
              <p className="text-sm text-gray-400 mt-2">강의실을 예약해보세요!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
