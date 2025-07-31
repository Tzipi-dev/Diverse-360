import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import  {setupApiStore}  from '../../../app/setupApiStore'; // ראה הסבר בהמשך
import courseApiSlice, {
  useGetAllCoursesQuery,
  useGetCourseByTitleQuery,
} from '../coursesApi';

describe('courseApiSlice', () => {
  // יצירת store זמני עם ה-api slice לצורך בדיקות (setupApiStore זו פונקציה עזר - ראה הסבר)
//   const storeRef = setupApiStore(courseApiSlice);

  it('should fetch all courses', async () => {
    const { result } = renderHook(() => useGetAllCoursesQuery(), {
    //   wrapper: storeRef.wrapper,
    });

    // מחכים עד שisSuccess יהיה true
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
  });

  it('should fetch course by title', async () => {
    const { result } = renderHook(() => useGetCourseByTitleQuery('React'), {
    //   wrapper: storeRef.wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.title).toBe('React');
  });
});
