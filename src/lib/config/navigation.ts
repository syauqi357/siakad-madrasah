import type { NavItem, UserRole } from '$lib/types/navigation';

export interface NavItem {
	name: string;
	href: string;
	icon?: string;
	hasDropdown?: boolean;
	children?: NavChild[];
}

export interface NavChild {
	name: string;
	href: string;
	icon?: string;
}

export type UserRole = 'admin' | 'teacher' | 'student';
export interface User {
	id: number;
	username: string;
	email: string;
	role: UserRole;
}

export const navigationConfig: Record<UserRole, NavItem[]> = {
	admin: [
		{
			name: 'Dashboard',
			href: '/'
		},
		{
			name: 'sarana prasarana',
			href: '/sarpras',
			hasDropdown: true,
			children: [
				{ name: 'aset tetap', icon: '', href: '/sarpras/assettetap' },
				{ name: 'aset lancar', icon: '', href: '/sarpras/asetlancar' },
				{ name: 'perpustakaan', icon: '', href: '/sarpras/perpustakaan' }
			]
		},
		{
			name: 'Student',
			href: '/siswa',
			hasDropdown: true,
			children: [
				{ name: 'Student List', icon: '', href: '/siswa' },
				{ name: 'Alumni', href: '/siswa/alumni' },
				{ name: 'Mutasi Out', href: '/siswa/mutasi-keluar' },
				{ name: 'Mutasi In', href: '/siswa/mutasi-masuk' },
				{ name: 'Kenaikan Kelas', href: '/siswa/kenaikan-kelas' },
				{ name: 'Siswa Ganda', href: '/siswa/siswa-ganda' },
				{ name: 'PIP/KIP-K/Beasiswa', href: '/siswa/beasiswa' }
			]
		},
		{
			name: 'Rombel',
			href: '/rombel'
		},
		{
			name: 'guru & tendik',
			href: '/gurutendik',
			hasDropdown: true,
			children: [
				{ name: 'daftar GTK', href: '/gurutendik/daftar-gtk' },
				{ name: 'pengajuan GTK', href: '/gurutendik/ajuan-gtk' },
				{ name: 'mutasi', href: '/gurutendik/mutasi' },
				{ name: 'akun', href: '/gurutendik/akun' }
			]
		},
		{
			name: 'nilai siswa',
			href: '/score',
			hasDropdown: true,
			children: [
				{ name: 'ujian', href: '/score/exam' },
				{ name: 'tugas', href: '/score/task' },
				{ name: 'mata pelajaran', href: '/score/subject' },
				{ name: 'kenaikan kelas', href: '/score/upgrade' }
			]
		},
		{
			name: 'konfirmasi',
			href: '/confirm',
			hasDropdown: true,
			children: [
				{ name: 'kelembagaan', href: '/confirm/lembaga' },
				{ name: 'sarana prasarana', href: '/confirm/sarpras' },
				{ name: 'siswa', href: '/confirm/studentdata' },
				{ name: 'guru tendik', href: '/confirm/teacher' }
			]
		},
		{
			name: 'info lainnya',
			href: '/info',
			hasDropdown: true,
			children: [
				{ name: 'daftar kurikulum', href: '/info/cirriculum' },
				{ name: 'hari sekolah', href: '/info/daysch' }
			]
		},
		{
			name: 'Audit Logs',
			href: '/admin/audit_logs'
		}
	],

	teacher: [
		{
			name: 'Dashboard',
			href: '/'
		},
		{
			name: 'sarana prasarana',
			href: '/sarpras',
			hasDropdown: true,
			children: [
				{ name: 'aset tetap', href: '/sarpras/assettetap' },
				{ name: 'aset lancar', href: '/sarpras/asetlancar' },
				{ name: 'perpustakaan', href: '/sarpras/perpustakaan' }
			]
		},
		{
			name: 'Student',
			href: '/siswa',
			hasDropdown: true,
			children: [
				{ name: 'Student List', href: '/siswa' },
				{ name: 'Alumni', href: '/siswa/alumni' }
			]
		},
		{
			name: 'Rombel',
			href: '/rombel'
		},
		{
			name: 'nilai siswa',
			href: '/score',
			hasDropdown: true,
			children: [
				{ name: 'ujian', href: '/score/exam' },
				{ name: 'tugas', href: '/score/task' },
				{ name: 'mata pelajaran', href: '/score/subject' }
			]
		},
		{
			name: 'info lainnya',
			href: '/info',
			hasDropdown: true,
			children: [
				{ name: 'daftar kurikulum', href: '/info/cirriculum' },
				{ name: 'hari sekolah', href: '/info/daysch' }
			]
		}
	],

	student: [
		{
			name: 'Dashboard',
			href: '/'
		},
		{
			name: 'Nilai Saya',
			href: '/my-score'
		},
		{
			name: 'Profil',
			href: '/profile'
		}
	]
};