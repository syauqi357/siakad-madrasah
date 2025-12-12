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

export type UserRole = 'admin' | 'teacher';
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
			icon: '',
			href: '/dashboard/[admin]'
		},
		{
			name: 'sarana prasarana',
			icon: '',
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
			icon: '',
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
			icon: '',
			href: '/rombel'
		},
		{
			name: 'guru & tendik',
			icon: '',
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
			icon: '',
			href: '/score',
			hasDropdown: true,
			children: [
				{ name: 'ujian',icon: '', href: '/score/exam' },
				{ name: 'tugas',icon: '', href: '/score/task' },
				{ name: 'mata pelajaran',icon: '', href: '/score/subject' },
				{ name: 'kenaikan kelas',icon: '', href: '/score/upgrade' }
			]
		},
		{
			name: 'konfirmasi',
			icon: '',
			href: '/confirm',
			hasDropdown: true,
			children: [
				{ name: 'kelembagaan', icon: '', href: '/confirm/lembaga' },
				{ name: 'sarana prasarana', icon: '', href: '/confirm/sarpras' },
				{ name: 'siswa', icon: '', href: '/confirm/studentdata' },
				{ name: 'guru tendik', icon: '', href: '/confirm/teacher' }
			]
		},
		{
			name: 'info lainnya',
			icon: '',
			href: '/info',
			hasDropdown: true,
			children: [
				{ name: 'daftar kurikulum', icon: '', href: '/info/curriculum' },
				{ name: 'hari sekolah', icon: '', href: '/info/daysch' }
			]
		},
		{
			name: 'Audit Logs',
			icon: '',
			href: '/admin/audit_logs'
		}
	],

	teacher: [
		{
			name: 'Dashboard',
			icon: '',
			href: '/dashboard'
		},
		{
			name: 'sarana prasarana',
			icon: '',
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
			icon: '',
			href: '/siswa',
			hasDropdown: true,
			children: [
				{ name: 'Student List',icon: '', href: '/siswa' },
				{ name: 'Alumni', icon: '', href: '/siswa/alumni' }
			]
		},
		{
			name: 'Rombel',
			icon: '',
			href: '/rombel'
		},
		{
			name: 'nilai siswa',
			icon: '',
			href: '/score',
			hasDropdown: true,
			children: [
				{ name: 'ujian',icon: '', href: '/score/exam' },
				{ name: 'tugas',icon: '', href: '/score/task' },
				{ name: 'mata pelajaran', icon: '', href: '/score/subject' }
			]
		},
		{
			name: 'info lainnya',
			icon: '',
			href: '/info',
			hasDropdown: true,
			children: [
				{ name: 'daftar kurikulum', icon: '', href: '/info/curriculum' },
				{ name: 'hari sekolah', icon: '', href: '/info/daysch' }
			]
		}
	]
};