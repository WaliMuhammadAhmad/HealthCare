export type AdminStats = {
  totalUsers: number;
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  activeDoctors: number;
  appointmentRate: number;
  growth: {
    usersGrowth: number;
    patientsGrowth: number;
    doctorsGrowth: number;
    appointmentsGrowth: number;
    activeDoctorsGrowth: number;
    appointmentRateGrowth: number;
  };
};
