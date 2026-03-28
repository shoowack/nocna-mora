export const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("hr-HR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const formatDateTime = (date: Date) =>
  new Date(date).toLocaleString("hr-HR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
