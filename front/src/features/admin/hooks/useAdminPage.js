import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAdminReservations, updateReservationStatus } from '../../../apis/adminApi';
import { toApprovalModalDetail } from '../utils/formatters';

/** @typedef {'ALL'|'PENDING'|'APPROVED'} AdminFilter */

/**
 * @typedef {Object} AdminReservation
 * @property {string} id
 * @property {string} classroomName
 * @property {string} classroomFloor
 * @property {string} reservationDate
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} title
 * @property {string} reason
 * @property {string} applicantName
 * @property {string} applicantDepartment
 * @property {string} applicantStudentId
 * @property {string} [applicantEmail]
 * @property {string} status
 */

export const FILTER_TAB_STYLES = {
  ALL: {
    active: 'bg-gachon-blue text-white shadow-[0_4px_12px_-4px_rgb(1_79_158_/_0.45)]',
    inactive:
      'bg-surface-soft text-text-secondary hover:bg-gachon-blue-tint hover:text-gachon-blue',
  },
  PENDING: {
    active: 'bg-mudang-red text-white shadow-[0_4px_12px_-4px_rgb(220_27_27_/_0.4)]',
    inactive:
      'bg-surface-soft text-text-secondary hover:bg-mudang-red-tint hover:text-mudang-red',
  },
  APPROVED: {
    active: 'bg-success-green text-white shadow-[0_4px_12px_-4px_rgb(0_166_62_/_0.4)]',
    inactive:
      'bg-surface-soft text-text-secondary hover:bg-success-green-tint hover:text-success-green',
  },
};

const useAdminPage = () => {
  const [allReservations, setAllReservations] = useState([]);
  const [filter, setFilter] = useState(/** @type {AdminFilter} */ ('ALL'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(/** @type {AdminReservation|null} */ (null));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadReservations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAdminReservations('ALL');
      setAllReservations(res.data ?? []);
    } catch (err) {
      setError(err.message || '예약 목록을 불러오지 못했습니다.');
      setAllReservations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const counts = useMemo(
    () => ({
      total: allReservations.length,
      pending: allReservations.filter((item) => item.status === 'PENDING').length,
      approved: allReservations.filter((item) => item.status === 'APPROVED').length,
    }),
    [allReservations],
  );

  const filteredReservations = useMemo(() => {
    if (filter === 'ALL') return allReservations;
    return allReservations.filter((item) => item.status === filter);
  }, [allReservations, filter]);

  const openDetail = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeDetail = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleApprove = async (memo) => {
    if (!selectedItem) return;
    try {
      await updateReservationStatus(selectedItem.id, {
        status: 'APPROVED',
        adminMemo: memo || undefined,
      });
      alert('예약이 승인되었습니다.');
      closeDetail();
      await loadReservations();
    } catch (err) {
      alert(err.message || '승인 처리에 실패했습니다.');
    }
  };

  const handleReject = async (memo) => {
    if (!selectedItem) return;
    try {
      await updateReservationStatus(selectedItem.id, {
        status: 'REJECTED',
        adminMemo: memo || undefined,
      });
      alert('예약이 반려되었습니다.');
      closeDetail();
      await loadReservations();
    } catch (err) {
      alert(err.message || '반려 처리에 실패했습니다.');
    }
  };

  const modalDetail = selectedItem ? toApprovalModalDetail(selectedItem) : null;
  const canReview = selectedItem?.status === 'PENDING';

  return {
    filter,
    setFilter,
    counts,
    filteredReservations,
    isLoading,
    error,
    isModalOpen,
    modalDetail,
    canReview,
    openDetail,
    closeDetail,
    handleApprove,
    handleReject,
    loadReservations,
  };
};

export default useAdminPage;
