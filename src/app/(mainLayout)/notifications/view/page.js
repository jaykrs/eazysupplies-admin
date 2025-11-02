'use client'
import FormWrapper from "@/utils/hoc/FormWrapper";
import NotificationForm from "@/components/notifications/notificationForm";
import { useParams, useSearchParams } from "next/navigation";
const ViewNotification = () => {
    const searchParams = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());
    return (
        <FormWrapper title="Notification">
            <NotificationForm buttonName="Back" data={params} />
        </FormWrapper>
    );
};

export default ViewNotification;
