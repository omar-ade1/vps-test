import { GET_ALL_RESULT_OF_ONE_EXAM } from "@/app/fetchApi/handelResultOfExam/getAllResultOfOneExam";
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Props {
  courseId: string | null;
  testId: string | null;
}
interface OldResult {
  id: number;
  allResult: number;
  wrongAnswer: number;
  correctAnswer: number;
  createdAt: string;
}

const OldResultsTable: React.FC<Props> = ({ courseId, testId }) => {
  // Old Result Of User In The Exam
  const [OldResult, setOldResult] = useState<OldResult[]>([]);
  const [loadingTable, setLoadingTable] = useState<boolean>(true);

  // Handel Get Old Results
  const getOldResults = async () => {
    setLoadingTable(true);
    if (courseId && testId) {
      const message: any = await GET_ALL_RESULT_OF_ONE_EXAM(courseId, testId);
      if (message.request.status === 200) {
        setOldResult(message.data.message);
      } else {
        Swal.fire({
          title: "حدث خطأ اثناء جلب البيانات",
          text: "يرجى المحاولة مرة اخرى لاحقا",
          icon: "error",
        });
      }
    }
    setLoadingTable(false);
  };

  useEffect(() => {
    getOldResults();
  }, []);

  return (
    <div className="table-of-old-results my-10">
      <h2 className="text-xl font-bold text-center my-2">نتائجك السابقة لهذا الاختبار</h2>
      <Table cellPadding="20" fullWidth shadow="lg" aria-label="Example static collection table">
        <TableHeader>
          <TableColumn className="text-lg font-bold border-2">#</TableColumn>
          <TableColumn className="text-lg font-bold border-2">التاريخ</TableColumn>
          <TableColumn className="text-lg font-bold border-2">الدرجة الكلية</TableColumn>
          <TableColumn className="text-lg font-bold border-2">درجتك</TableColumn>
          <TableColumn className="text-lg font-bold border-2">النسبة المئوية</TableColumn>
        </TableHeader>

        <TableBody emptyContent={"لم يتم العثور على نتائج سابقة لهذا الإختبار"} isLoading={loadingTable} loadingContent={<Spinner size="lg" />}>
          {loadingTable
            ? []
            : OldResult.length
            ? OldResult.map((result, i) => {
                return (
                  <TableRow key={result.id}>
                    <TableCell className="text-lg font-bold border-2 text-nowrap whitespace-nowrap p-5">{i + 1}</TableCell>
                    <TableCell className="text-lg font-bold border-2 text-nowrap whitespace-nowrap p-5">
                      {format(new Date(result.createdAt), "PPpp")}
                    </TableCell>
                    <TableCell className="text-lg font-bold border-2 text-nowrap whitespace-nowrap p-5">{result.allResult}</TableCell>
                    <TableCell className="text-lg font-bold border-2 text-nowrap whitespace-nowrap p-5">{result.correctAnswer}</TableCell>
                    <TableCell className="text-lg font-bold border-2 text-nowrap whitespace-nowrap p-5">
                      {((result.correctAnswer / result.allResult) * 100).toFixed(2)}%
                    </TableCell>
                  </TableRow>
                );
              })
            : []}
        </TableBody>
      </Table>
    </div>
  );
};

export default OldResultsTable;
