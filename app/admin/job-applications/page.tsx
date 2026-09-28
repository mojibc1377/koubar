"use client";

import { useState } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

import {
  useAdminJobApplications,
  useJobApplicationMutations,
} from "@/hooks/use-admin";

type Department = "CAFE" | "ROASTERY" | "GENERAL";

type ApplicationStatus =
  | "SUBMITTED"
  | "IN_REVIEW"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "REJECTED";

type MarriageStatus = "SINGLE" | "MARRIED";

type MilitaryStatus =
  | "NOT_APPLICABLE"
  | "IN_PROGRESS"
  | "COMPLETED";

const MARRIAGE_STATUSES = [
  {
    value: "SINGLE",
    label: "مجرد",
  },
  {
    value: "MARRIED",
    label: "متأهل",
  },
] as const;

const MILITARY_STATUSES = [
  {
    value: "NOT_APPLICABLE",
    label: "مشمول نیستم",
  },
  {
    value: "IN_PROGRESS",
    label: "در حال انجام",
  },
  {
    value: "COMPLETED",
    label: "انجام شده",
  },
] as const;

const departmentLabels: Record<Department, string> = {
  CAFE: "کافه",
  ROASTERY: "رستری",
  GENERAL: "عمومی",
};

const marriageStatusLabels: Record<MarriageStatus, string> = {
  SINGLE: "مجرد",
  MARRIED: "متأهل",
};

const militaryStatusLabels: Record<MilitaryStatus, string> = {
  NOT_APPLICABLE: "مشمول نیستم",
  IN_PROGRESS: "در حال انجام",
  COMPLETED: "انجام شده",
};

const statusLabels: Record<ApplicationStatus, string> = {
  SUBMITTED: "ارسال شده",
  IN_REVIEW: "در حال بررسی",
  INTERVIEW: "مصاحبه",
  OFFER: "پیشنهاد همکاری",
  HIRED: "استخدام شده",
  REJECTED: "رد شده",
};

const statusStyles: Record<ApplicationStatus, string> = {
  SUBMITTED:
    "bg-blue-400/10 text-blue-200 border-blue-400/20",

  IN_REVIEW:
    "bg-yellow-400/10 text-yellow-200 border-yellow-400/20",

  INTERVIEW:
    "bg-purple-400/10 text-purple-200 border-purple-400/20",

  OFFER:
    "bg-orange-400/10 text-orange-200 border-orange-400/20",

  HIRED:
    "bg-green-400/10 text-green-200 border-green-400/20",

  REJECTED:
    "bg-red-400/10 text-red-200 border-red-400/20",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function InfoItem({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-[#fffbf5]/40">
        {label}
      </p>

      <div className="mt-1 text-sm font-semibold text-[#fffbf5]/90">
        {children}
      </div>
    </div>
  );
}

export default function JobApplicationsPage() {
  const {
    data: applications = [],
    isLoading,
    isError,
    error,
  } = useAdminJobApplications();

  const { update, remove } = useJobApplicationMutations();

  const [selectedId, setSelectedId] = useState<string | null>(
    null,
  );

  const selectedApplication =
    applications.find(
      (application) => application.id === selectedId,
    ) ?? null;

  /*
   * DELETE
   */
  async function handleDelete(id: string) {
    const application = applications.find(
      (item) => item.id === id,
    );

    if (!application) return;

    const confirmed = window.confirm(
      `آیا مطمئن هستید که می‌خواهید درخواست ${application.fullName} را حذف کنید؟\n\nاین عملیات قابل بازگشت نیست.`,
    );

    if (!confirmed) return;

    try {
      await remove.mutateAsync(id);

      if (selectedId === id) {
        setSelectedId(null);
      }
    } catch (error) {
      console.error(
        "Failed to delete application:",
        error,
      );

      window.alert(
        "حذف درخواست با خطا مواجه شد.",
      );
    }
  }

  /*
   * UPDATE STATUS
   */
  async function handleStatusChange(
    id: string,
    status: ApplicationStatus,
  ) {
    try {
      await update.mutateAsync({
        id,
        status,
      });
    } catch (error) {
      console.error(
        "Failed to update application:",
        error,
      );

      window.alert(
        "تغییر وضعیت با خطا مواجه شد.",
      );
    }
  }

  /*
   * LOADING
   */
  if (isLoading) {
    return (
      <>
        <AdminPageHeader
          title="درخواست‌های استخدام"
          description="مدیریت درخواست‌های همکاری و استخدام"
        />

        <div
          dir="rtl"
          className="rounded-2xl border border-[#fffbf51a] bg-[#3d3d3a] p-6"
        >
          <p className="text-sm text-[#fffbf5]/60">
            در حال بارگذاری درخواست‌ها…
          </p>
        </div>
      </>
    );
  }

  /*
   * ERROR
   */
  if (isError) {
    return (
      <>
        <AdminPageHeader
          title="درخواست‌های استخدام"
          description="مدیریت درخواست‌های همکاری و استخدام"
        />

        <div
          dir="rtl"
          className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6"
        >
          <p className="font-semibold text-red-200">
            دریافت درخواست‌ها با خطا مواجه شد.
          </p>

          {error instanceof Error && (
            <p className="mt-2 text-xs text-red-200/60">
              {error.message}
            </p>
          )}
        </div>
      </>
    );
  }

  /*
   * STATISTICS
   */
  const submittedCount = applications.filter(
    (item) => item.status === "SUBMITTED",
  ).length;

  const reviewCount = applications.filter(
    (item) => item.status === "IN_REVIEW",
  ).length;

  const interviewCount = applications.filter(
    (item) => item.status === "INTERVIEW",
  ).length;

  const hiredCount = applications.filter(
    (item) => item.status === "HIRED",
  ).length;

  return (
    <>
      <AdminPageHeader
        title="درخواست‌های استخدام"
        description="مدیریت درخواست‌های همکاری و استخدام"
      />

      <div dir="rtl" className="space-y-6">

        {/* ======================================== */}
        {/* STATISTICS */}
        {/* ======================================== */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <div className="rounded-2xl border border-[#fffbf51a] bg-[#3d3d3a] p-5">
            <p className="text-xs text-[#fffbf5]/60">
              کل درخواست‌ها
            </p>

            <p className="mt-2 text-2xl font-extrabold">
              {applications.length.toLocaleString("fa-IR")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#fffbf51a] bg-[#3d3d3a] p-5">
            <p className="text-xs text-[#fffbf5]/60">
              جدید
            </p>

            <p className="mt-2 text-2xl font-extrabold">
              {submittedCount.toLocaleString("fa-IR")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#fffbf51a] bg-[#3d3d3a] p-5">
            <p className="text-xs text-[#fffbf5]/60">
              در حال بررسی
            </p>

            <p className="mt-2 text-2xl font-extrabold">
              {reviewCount.toLocaleString("fa-IR")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#fffbf51a] bg-[#3d3d3a] p-5">
            <p className="text-xs text-[#fffbf5]/60">
              مصاحبه
            </p>

            <p className="mt-2 text-2xl font-extrabold">
              {interviewCount.toLocaleString("fa-IR")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#fffbf51a] bg-[#3d3d3a] p-5">
            <p className="text-xs text-[#fffbf5]/60">
              استخدام شده
            </p>

            <p className="mt-2 text-2xl font-extrabold">
              {hiredCount.toLocaleString("fa-IR")}
            </p>
          </div>

        </div>

        {/* ======================================== */}
        {/* EMPTY STATE */}
        {/* ======================================== */}

        {applications.length === 0 && (
          <div className="rounded-2xl border border-[#fffbf51a] bg-[#3d3d3a] px-6 py-16 text-center">
            <div className="mx-auto max-w-md">

              <p className="text-xl font-bold">
                هنوز درخواستی ثبت نشده است
              </p>

              <p className="mt-3 text-sm leading-7 text-[#fffbf5]/50">
                درخواست‌های استخدامی که از طریق فرم
                استخدام سایت ارسال شوند، در این قسمت
                نمایش داده خواهند شد.
              </p>

            </div>
          </div>
        )}

        {/* ======================================== */}
        {/* APPLICATION TABLE */}
        {/* ======================================== */}

        {applications.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-[#fffbf51a] bg-[#3d3d3a]">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1250px]">

                <thead>
                  <tr className="border-b border-[#fffbf51a] text-right text-xs text-[#fffbf5]/50">

                    <th className="px-5 py-4 font-medium">
                      متقاضی
                    </th>

                    <th className="px-5 py-4 font-medium">
                      سن
                    </th>

                    <th className="px-5 py-4 font-medium">
                      موقعیت شغلی
                    </th>

                    <th className="px-5 py-4 font-medium">
                      بخش
                    </th>

                    <th className="px-5 py-4 font-medium">
                      وضعیت تأهل
                    </th>

                    <th className="px-5 py-4 font-medium">
                      وضعیت نظام وظیفه
                    </th>

                    <th className="px-5 py-4 font-medium">
                      اطلاعات تماس
                    </th>

                    <th className="px-5 py-4 font-medium">
                      وضعیت
                    </th>

                    <th className="px-5 py-4 font-medium">
                      تاریخ
                    </th>

                    <th className="px-5 py-4 font-medium">
                      عملیات
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {applications.map((application) => {

                    const isDeleting =
                      remove.isPending &&
                      remove.variables === application.id;

                    const isUpdating =
                      update.isPending &&
                      update.variables?.id === application.id;

                    return (
                      <tr
                        key={application.id}
                        className="border-b border-[#fffbf50d] transition hover:bg-[#575b49]/20"
                      >

                        {/* APPLICANT */}

                        <td className="px-5 py-5">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedId(application.id)
                            }
                            className="text-right"
                          >
                            <p className="font-bold transition hover:underline">
                              {application.fullName}
                            </p>

                            <p className="mt-1 text-xs text-[#fffbf5]/40">
                              {application.applicationNumber}
                            </p>
                          </button>
                        </td>

                        {/* AGE */}

                        <td className="px-5 py-5">
                          <p className="whitespace-nowrap text-sm">
                            {application.age != null
                              ? `${application.age.toLocaleString(
                                  "fa-IR",
                                )} سال`
                              : "ثبت نشده"}
                          </p>
                        </td>

                        {/* POSITION */}

                        <td className="px-5 py-5">
                          <p className="text-sm font-medium">
                            {application.positionTitle}
                          </p>
                        </td>

                        {/* DEPARTMENT */}

                        <td className="px-5 py-5">
                          <span className="inline-flex rounded-lg border border-[#fffbf51a] bg-[#575b49]/30 px-3 py-1.5 text-xs">
                            {
                              departmentLabels[
                                application.department
                              ]
                            }
                          </span>
                        </td>

                        {/* MARRIAGE */}

                        <td className="px-5 py-5">
                          <span className="text-sm">
                            {application.marriageStatus
                              ? marriageStatusLabels[
                                  application
                                    .marriageStatus as MarriageStatus
                                ]
                              : "ثبت نشده"}
                          </span>
                        </td>

                        {/* MILITARY */}

                        <td className="px-5 py-5">
                          <span className="text-sm">
                            {application.militaryStatus
                              ? militaryStatusLabels[
                                  application
                                    .militaryStatus as MilitaryStatus
                                ]
                              : "ثبت نشده"}
                          </span>
                        </td>

                        {/* CONTACT */}

                        <td className="px-5 py-5">

                          <p
                            dir="ltr"
                            className="text-right text-sm"
                          >
                            {application.phone}
                          </p>

                          {application.email && (
                            <p
                              dir="ltr"
                              className="mt-1 text-right text-xs text-[#fffbf5]/40"
                            >
                              {application.email}
                            </p>
                          )}

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-5">

                          <select
                            value={application.status}
                            disabled={isUpdating}
                            onChange={(event) =>
                              handleStatusChange(
                                application.id,
                                event.target
                                  .value as ApplicationStatus,
                              )
                            }
                            className={`rounded-xl border px-3 py-2 text-xs outline-none ${
                              statusStyles[
                                application.status
                              ]
                            }`}
                          >

                            {(
                              Object.entries(
                                statusLabels,
                              ) as [
                                ApplicationStatus,
                                string,
                              ][]
                            ).map(
                              ([value, label]) => (
                                <option
                                  key={value}
                                  value={value}
                                  className="bg-[#30302e] text-[#fffbf5]"
                                >
                                  {label}
                                </option>
                              ),
                            )}

                          </select>

                        </td>

                        {/* DATE */}

                        <td className="px-5 py-5">
                          <p className="whitespace-nowrap text-xs text-[#fffbf5]/55">
                            {formatDate(
                              application.createdAt,
                            )}
                          </p>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedId(
                                  application.id,
                                )
                              }
                              className="rounded-xl border border-[#fffbf52e] px-3 py-2 text-xs transition hover:bg-[#575b49]/40"
                            >
                              مشاهده
                            </button>

                            {application.resumeUrl && (
                              <a
                                href={
                                  application.resumeUrl.startsWith(
                                    "http",
                                  )
                                    ? application.resumeUrl
                                    : `https://koubar.ir/${application.resumeUrl.replace(
                                        /^\/+/,
                                        "",
                                      )}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl border border-[#fffbf52e] px-3 py-2 text-xs transition hover:bg-[#575b49]/40"
                              >
                                رزومه
                              </a>
                            )}

                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() =>
                                handleDelete(
                                  application.id,
                                )
                              }
                              className="rounded-xl border border-red-400/20 px-3 py-2 text-xs text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {isDeleting
                                ? "در حال حذف…"
                                : "حذف"}
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>
        )}

        {/* ======================================== */}
        {/* DETAILS */}
        {/* ======================================== */}

        {selectedApplication && (
          <div className="rounded-2xl border border-[#fffbf51a] bg-[#3d3d3a] p-6">

            {/* HEADER */}

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-xs text-[#fffbf5]/40">
                  جزئیات کامل درخواست
                </p>

                <h2 className="mt-1 text-xl font-extrabold">
                  {selectedApplication.fullName}
                </h2>

                <p className="mt-1 text-xs text-[#fffbf5]/35">
                  شماره درخواست:{" "}
                  {selectedApplication.applicationNumber}
                </p>

              </div>

              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-xl border border-[#fffbf52e] px-4 py-2 text-xs transition hover:bg-[#575b49]/40"
              >
                بستن
              </button>

            </div>

            {/* ======================================== */}
            {/* PERSONAL INFORMATION */}
            {/* ======================================== */}

            <div className="mt-8">

              <div className="mb-4 flex items-center gap-3">

                <div className="h-px flex-1 bg-[#fffbf51a]" />

                <p className="text-xs font-semibold text-[#fffbf5]/50">
                  اطلاعات شخصی
                </p>

                <div className="h-px flex-1 bg-[#fffbf51a]" />

              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                <InfoItem label="نام و نام خانوادگی">
                  {selectedApplication.fullName}
                </InfoItem>

                <InfoItem label="سن">
                  {selectedApplication.age != null
                    ? `${selectedApplication.age.toLocaleString(
                        "fa-IR",
                      )} سال`
                    : "ثبت نشده"}
                </InfoItem>

                <InfoItem label="وضعیت تأهل">
                  {selectedApplication.marriageStatus
                    ? marriageStatusLabels[
                        selectedApplication
                          .marriageStatus as MarriageStatus
                      ]
                    : "ثبت نشده"}
                </InfoItem>

                <InfoItem label="وضعیت نظام وظیفه">
                  {selectedApplication.militaryStatus
                    ? militaryStatusLabels[
                        selectedApplication
                          .militaryStatus as MilitaryStatus
                      ]
                    : "ثبت نشده"}
                </InfoItem>

                <InfoItem label="شماره تماس">
                  <a
                    href={`tel:${selectedApplication.phone}`}
                    dir="ltr"
                    className="block text-right hover:underline"
                  >
                    {selectedApplication.phone}
                  </a>
                </InfoItem>

                <InfoItem label="ایمیل">
                  {selectedApplication.email ? (
                    <a
                      href={`mailto:${selectedApplication.email}`}
                      dir="ltr"
                      className="block text-right hover:underline"
                    >
                      {selectedApplication.email}
                    </a>
                  ) : (
                    <span className="text-[#fffbf5]/40">
                      ثبت نشده
                    </span>
                  )}
                </InfoItem>

              </div>

            </div>

            {/* ======================================== */}
            {/* JOB INFORMATION */}
            {/* ======================================== */}

            <div className="mt-8">

              <div className="mb-4 flex items-center gap-3">

                <div className="h-px flex-1 bg-[#fffbf51a]" />

                <p className="text-xs font-semibold text-[#fffbf5]/50">
                  اطلاعات شغلی
                </p>

                <div className="h-px flex-1 bg-[#fffbf51a]" />

              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                <InfoItem label="موقعیت شغلی">
                  {selectedApplication.positionTitle}
                </InfoItem>

                <InfoItem label="بخش">
                  {departmentLabels[
                    selectedApplication.department
                  ]}
                </InfoItem>

                <InfoItem label="وضعیت درخواست">
                  <span
                    className={`inline-flex rounded-lg border px-3 py-1.5 text-xs ${
                      statusStyles[
                        selectedApplication.status
                      ]
                    }`}
                  >
                    {
                      statusLabels[
                        selectedApplication.status
                      ]
                    }
                  </span>
                </InfoItem>

              </div>

            </div>

            {/* ======================================== */}
            {/* APPLICATION INFORMATION */}
            {/* ======================================== */}

            <div className="mt-8">

              <div className="mb-4 flex items-center gap-3">

                <div className="h-px flex-1 bg-[#fffbf51a]" />

                <p className="text-xs font-semibold text-[#fffbf5]/50">
                  اطلاعات درخواست
                </p>

                <div className="h-px flex-1 bg-[#fffbf51a]" />

              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                <InfoItem label="شماره درخواست">
                  <span dir="ltr">
                    {selectedApplication.applicationNumber}
                  </span>
                </InfoItem>

                <InfoItem label="تاریخ ثبت">
                  {formatDate(
                    selectedApplication.createdAt,
                  )}
                </InfoItem>

                <InfoItem label="آخرین بروزرسانی">
                  {formatDate(
                    selectedApplication.updatedAt,
                  )}
                </InfoItem>

              </div>

            </div>

            {/* ======================================== */}
            {/* RESUME */}
            {/* ======================================== */}

            <div className="mt-8">

              <div className="mb-4 flex items-center gap-3">

                <div className="h-px flex-1 bg-[#fffbf51a]" />

                <p className="text-xs font-semibold text-[#fffbf5]/50">
                  رزومه
                </p>

                <div className="h-px flex-1 bg-[#fffbf51a]" />

              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-[#fffbf51a] bg-[#30302e] p-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="min-w-0">

                  <p className="text-xs text-[#fffbf5]/40">
                    فایل رزومه
                  </p>

                  <p
                    className="mt-1 truncate text-sm font-semibold"
                    title={
                      selectedApplication.resumeFileName
                    }
                  >
                    {
                      selectedApplication.resumeFileName
                    }
                  </p>

                </div>

                {selectedApplication.resumeUrl && (
                  <a
                    href={
                      selectedApplication.resumeUrl.startsWith(
                        "http",
                      )
                        ? selectedApplication.resumeUrl
                        : `https://koubar.ir/${selectedApplication.resumeUrl.replace(
                            /^\/+/,
                            "",
                          )}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-xl bg-[#fffbf5] px-5 py-2.5 text-xs font-semibold text-[#30302e] transition hover:bg-[#d8d5cc]"
                  >
                    مشاهده رزومه
                  </a>
                )}

              </div>

            </div>

            {/* ======================================== */}
            {/* MESSAGE */}
            {/* ======================================== */}

            <div className="mt-8">

              <div className="mb-4 flex items-center gap-3">

                <div className="h-px flex-1 bg-[#fffbf51a]" />

                <p className="text-xs font-semibold text-[#fffbf5]/50">
                  پیام متقاضی
                </p>

                <div className="h-px flex-1 bg-[#fffbf51a]" />

              </div>

              <div className="rounded-2xl border border-[#fffbf51a] bg-[#30302e] p-5">

                {selectedApplication.message ? (
                  <p className="whitespace-pre-wrap text-sm leading-8 text-[#fffbf5]/80">
                    {selectedApplication.message}
                  </p>
                ) : (
                  <p className="text-sm text-[#fffbf5]/40">
                    متقاضی پیامی ثبت نکرده است.
                  </p>
                )}

              </div>

            </div>

            {/* ======================================== */}
            {/* DELETE */}
            {/* ======================================== */}

            <div className="mt-8 flex justify-end border-t border-[#fffbf51a] pt-6">

              <button
                type="button"
                disabled={remove.isPending}
                onClick={() =>
                  handleDelete(
                    selectedApplication.id,
                  )
                }
                className="rounded-xl border border-red-400/20 px-4 py-2.5 text-xs text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {remove.isPending
                  ? "در حال حذف…"
                  : "حذف این درخواست"}
              </button>

            </div>

          </div>
        )}

      </div>
    </>
  );
}