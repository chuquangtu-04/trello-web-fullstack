export const BOARD_TEMPLATES = [
  {
    id: 'kanban',
    name: 'Kanban',
    description: 'Quản lý công việc theo luồng kéo-thả cơ bản. Phù hợp cho mọi loại dự án.',
    icon: '📋',
    color: '#0052CC',
    gradient: 'linear-gradient(135deg, #0052CC 0%, #2684FF 100%)',
    background: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=80',
    columns: ['To Do', 'In Progress', 'Done']
  },
  {
    id: 'scrum',
    name: 'Scrum Sprint',
    description: 'Dành cho team Agile chạy Sprint. Có đầy đủ các cột theo quy trình Scrum.',
    icon: '🚀',
    color: '#00875A',
    gradient: 'linear-gradient(135deg, #00875A 0%, #57D9A3 100%)',
    background: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1400&q=80',
    columns: ['Backlog', 'Sprint', 'In Progress', 'Review', 'Done']
  },
  {
    id: 'bug-tracking',
    name: 'Bug Tracking',
    description: 'Theo dõi và xử lý lỗi theo mức độ ưu tiên từ khi báo cáo đến khi giải quyết.',
    icon: '🐛',
    color: '#DE350B',
    gradient: 'linear-gradient(135deg, #DE350B 0%, #FF8F73 100%)',
    background: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80',
    columns: ['Reported', 'Confirmed', 'In Fix', 'Testing', 'Resolved']
  },
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Quản lý dự án tổng quát từ ý tưởng đến hoàn thành. Dành cho project manager.',
    icon: '📊',
    color: '#6554C0',
    gradient: 'linear-gradient(135deg, #6554C0 0%, #998DD9 100%)',
    background: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1400&q=80',
    columns: ['Ideas', 'Planning', 'In Progress', 'Review', 'Completed']
  },
  {
    id: 'content-calendar',
    name: 'Content Calendar',
    description: 'Lên lịch và quản lý nội dung sáng tạo cho blog, social media hay marketing.',
    icon: '📅',
    color: '#FF5630',
    gradient: 'linear-gradient(135deg, #FF5630 0%, #FFAB00 100%)',
    background: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80',
    columns: ['Ideas', 'Writing', 'Editing', 'Ready to Publish', 'Published']
  },
  {
    id: 'personal-todo',
    name: 'Personal To-Do',
    description: 'Danh sách việc cần làm cá nhân đơn giản, gọn nhẹ và hiệu quả.',
    icon: '✅',
    color: '#36B37E',
    gradient: 'linear-gradient(135deg, #36B37E 0%, #ABF5D1 100%)',
    background: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
    columns: ['To Do', 'Doing', 'Done']
  },
  {
    id: 'recruitment',
    name: 'Recruitment Pipeline',
    description: 'Quản lý quy trình tuyển dụng từ khi nhận CV đến khi onboard nhân viên mới.',
    icon: '👥',
    color: '#0065FF',
    gradient: 'linear-gradient(135deg, #0065FF 0%, #4C9AFF 100%)',
    background: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80',
    columns: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired']
  },
  {
    id: 'design-workflow',
    name: 'Design Workflow',
    description: 'Quy trình thiết kế từ brief đến bàn giao. Phù hợp cho team designer.',
    icon: '🎨',
    color: '#FF7452',
    gradient: 'linear-gradient(135deg, #FF7452 0%, #FFC400 100%)',
    background: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1400&q=80',
    columns: ['Brief', 'Concept', 'Design', 'Feedback', 'Final']
  }
]
