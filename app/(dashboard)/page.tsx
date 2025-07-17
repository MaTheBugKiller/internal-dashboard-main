import { Tabs, TabsContent } from '@/components/ui/tabs';
import { FeedbacksTable } from './feedbacks-table';
 


export default function FeedbacksPage() {
  return (
    <Tabs defaultValue="all">
      <TabsContent value="all">
        <FeedbacksTable />
      </TabsContent>
    </Tabs>
  );
}