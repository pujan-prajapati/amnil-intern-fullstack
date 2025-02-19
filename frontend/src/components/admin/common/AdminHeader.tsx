interface AdminHeaderProps {
  title: string;
}

export const AdminHeader = ({ title }: AdminHeaderProps) => {
  return (
    <div className="text-4xl font-semibold underline mb-10 text-gray-600">
      {title}
    </div>
  );
};
