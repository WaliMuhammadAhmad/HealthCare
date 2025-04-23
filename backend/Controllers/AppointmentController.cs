using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthCareAPI.DTOs;
using System.Globalization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly HealthCareDbContext _context;

        public AppointmentController(HealthCareDbContext context)
        {
            _context = context;
        }

        // GET: api/Appointment
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .ToListAsync();

            var result = appointments.Select(a => new AppointmentResponseDto
            {
                AppointmentID = a.AppointmentID,
                PatientName = a.Patient!.FullName,
                PatientEmail = a.Patient!.Email,
                PatientImage = a.Patient!.ProfilePic,
                DoctorName = a.Doctor!.FullName,
                Specialty = a.Doctor!.Specialty,
                AppointmentDate = a.AppointmentDate,
                AppointmentTime = a.AppointmentTime,
                AppointmentType = a.AppointmentType,
                ReasonForVisit = a.ReasonForVisit,
                AppointmentStatus = a.AppointmentStatus,
                Notes = a.Notes,
                CancellationReason = a.CancellationReason,
                RescheduleReason = a.RescheduleReason,
                RescheduleDate = a.RescheduleDate,
                RescheduleTime = a.RescheduleTime,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            });

            return Ok(result);
        }

        // GET: api/Appointment/recent-appointments
        [HttpGet("recent-appointments")]
        public async Task<IActionResult> GetRecentAppointments()
        {
            var appointments = await _context.Appointments
                .OrderByDescending(a => a.CreatedAt)
                .Take(5)
                .Select(a => new
                {
                    id = a.AppointmentID,
                    patientName = a.Patient.FullName,
                    patientImage = a.Patient.ProfilePic,
                    doctor = a.Doctor.FullName,
                    date = a.AppointmentDate,
                    time = a.AppointmentTime
                })
                .ToListAsync();

            return Ok(appointments);
        }

        // GET: api/Appointment/1
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var a = await _context.Appointments
                .Include(x => x.Patient)
                .Include(x => x.Doctor)
                .FirstOrDefaultAsync(x => x.AppointmentID == id);

            if (a == null)
                return NotFound(new { message = "Appointment not found." });

            var dto = new AppointmentResponseDto
            {
                AppointmentID = a.AppointmentID,
                PatientName = a.Patient!.FullName,
                PatientEmail = a.Patient!.Email,
                PatientImage = a.Patient!.ProfilePic,
                DoctorName = a.Doctor!.FullName,
                Specialty = a.Doctor!.Specialty,
                AppointmentDate = a.AppointmentDate,
                AppointmentTime = a.AppointmentTime,
                AppointmentType = a.AppointmentType,
                ReasonForVisit = a.ReasonForVisit,
                AppointmentStatus = a.AppointmentStatus,
                Notes = a.Notes,
                CancellationReason = a.CancellationReason,
                RescheduleReason = a.RescheduleReason,
                RescheduleDate = a.RescheduleDate,
                RescheduleTime = a.RescheduleTime,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            };

            return Ok(dto);
        }

        // GET: api/Appointment/patient/1
        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetByPatientId(int patientId)
        {
            // Check if patient exists
            var patientExists = await _context.Patients.AnyAsync(p => p.PatientID == patientId);
            if (!patientExists)
                return NotFound(new { message = "Patient not found." });

            // Fetch all appointments for the patient
            var appointments = await _context.Appointments
                .Include(x => x.Patient)
                .Include(x => x.Doctor)
                .Where(x => x.PatientID == patientId)
                .ToListAsync();

            if (!appointments.Any())
                return NotFound(new { message = "No appointments found for this patient." });

            // Map to DTO
            var dtos = appointments.Select(a => new AppointmentResponseDto
            {
                AppointmentID = a.AppointmentID,
                PatientName = a.Patient!.FullName,
                PatientEmail = a.Patient!.Email,
                PatientImage = a.Patient!.ProfilePic,
                DoctorName = a.Doctor!.FullName,
                Specialty = a.Doctor!.Specialty,
                AppointmentDate = a.AppointmentDate,
                AppointmentTime = a.AppointmentTime,
                AppointmentType = a.AppointmentType,
                ReasonForVisit = a.ReasonForVisit,
                AppointmentStatus = a.AppointmentStatus,
                Notes = a.Notes,
                CancellationReason = a.CancellationReason,
                RescheduleReason = a.RescheduleReason,
                RescheduleDate = a.RescheduleDate,
                RescheduleTime = a.RescheduleTime,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            }).ToList();

            return Ok(dtos);
        }

        // POST: api/Appointment
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AppointmentDtos dto)
        {
            var a = new Appointment
            {
                PatientID = dto.PatientID,
                DoctorID = dto.DoctorID,
                Patient = await _context.Patients.FindAsync(dto.PatientID) ?? throw new ArgumentException("Invalid PatientID"),
                Doctor = await _context.Doctors.FindAsync(dto.DoctorID) ?? throw new ArgumentException("Invalid DoctorID"),
                AppointmentDate = dto.AppointmentDate,
                AppointmentTime = dto.AppointmentTime,
                AppointmentType = dto.AppointmentType,
                ReasonForVisit = dto.ReasonForVisit,
                AppointmentStatus = dto.AppointmentStatus ?? "Pending",
                Notes = dto.Notes,
                CancellationReason = dto.CancellationReason,
                RescheduleReason = dto.RescheduleReason,
                RescheduleDate = dto.RescheduleDate,
                RescheduleTime = dto.RescheduleTime,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Appointments.Add(a);
            await _context.SaveChangesAsync();

            dto.AppointmentID = a.AppointmentID;
            dto.CreatedAt = a.CreatedAt;
            dto.UpdatedAt = a.UpdatedAt;

            return CreatedAtAction(nameof(Get), new { id = a.AppointmentID }, dto);
        }

        // PUT: api/Appointment/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AppointmentDtos dto)
        {
            var a = await _context.Appointments.FindAsync(id);
            if (a == null)
                return NotFound(new { message = "Appointment not found." });

            a.PatientID = dto.PatientID;
            a.DoctorID = dto.DoctorID;
            a.AppointmentDate = dto.AppointmentDate;
            a.AppointmentTime = dto.AppointmentTime;
            a.AppointmentType = dto.AppointmentType;
            a.ReasonForVisit = dto.ReasonForVisit;
            a.AppointmentStatus = dto.AppointmentStatus ?? a.AppointmentStatus;
            a.Notes = dto.Notes;
            a.CancellationReason = dto.CancellationReason;
            a.RescheduleReason = dto.RescheduleReason;
            a.RescheduleDate = dto.RescheduleDate;
            a.RescheduleTime = dto.RescheduleTime;
            a.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Appointment updated successfully." });
        }

        // DELETE: api/Appointment/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var a = await _context.Appointments.FindAsync(id);
            if (a == null)
                return NotFound(new { message = "Appointment not found." });

            _context.Appointments.Remove(a);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment deleted successfully." });
        }

        // PATCH: api/Appointment/status/1
        [HttpPatch("status/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateAppointmentStatusDto request)
        {
            var a = await _context.Appointments.FindAsync(id);
            if (a == null)
                return NotFound(new { message = "Appointment not found." });

            if (string.IsNullOrWhiteSpace(request.Status))
                return BadRequest(new { message = "Status cannot be empty." });

            a.AppointmentStatus = request.Status;
            a.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Status updated." });
        }

        // PATCH: api/Appointment/cancel-reason/1
        [HttpPatch("cancel-reason/{id}")]
        public async Task<IActionResult> UpdateCancellationReason(int id, [FromBody] UpdateAppointmentCancellationReasonDto reason)
        {
            var a = await _context.Appointments.FindAsync(id);
            if (a == null)
                return NotFound(new { message = "Appointment not found." });

            if (string.IsNullOrWhiteSpace(reason.CancellationReason))
                return BadRequest(new { message = "Cancellation Reason cannot be empty." });

            a.CancellationReason = reason.CancellationReason;
            a.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cancellation Reason updated." });
        }

        // PATCH: api/Appointment/notes/1
        [HttpPatch("notes/{id}")]
        public async Task<IActionResult> UpdateNotes(int id, [FromBody] string notes)
        {
            var a = await _context.Appointments.FindAsync(id);
            if (a == null)
                return NotFound(new { message = "Appointment not found." });

            a.Notes = notes;
            a.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notes updated." });
        }

        // PATCH: api/Appointment/reschedule/1
        [HttpPatch("reschedule/{id}")]
        public async Task<IActionResult> UpdateReschedule(int id, [FromBody] AppointmentDtos dto)
        {
            var a = await _context.Appointments.FindAsync(id);
            if (a == null)
                return NotFound(new { message = "Appointment not found." });

            a.RescheduleReason = dto.RescheduleReason;
            a.RescheduleDate = dto.RescheduleDate;
            a.RescheduleTime = dto.RescheduleTime;
            a.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Reschedule info updated." });
        }
    
        // GET: api/Appointment/doctor/{doctorId}/booked
        [HttpGet("doctor/{doctorId}/booked")]
        public async Task<IActionResult> GetDoctorBookedAppointments(int doctorId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.DoctorID == doctorId && a.AppointmentStatus == "Scheduled")
                .Select(a => new
                {
                    a.AppointmentID,
                    a.AppointmentDate,
                    a.AppointmentTime
                })
                .ToListAsync();

            if (appointments == null || appointments.Count == 0)
            {
                return NotFound(new { message = "No scheduled appointments found for this doctor." });
            }

            return Ok(appointments);
        }
    
        // GET: api/Appointment/user-stats/1
        [HttpGet("user-stats/{id}")]
        public async Task<IActionResult> GetPatientStats(int id)
        {
        var totalAppointments = await _context.Appointments
        .Where(a => a.PatientID == id)
        .CountAsync();

        var now = DateTime.UtcNow;

        var upcomingAppointments = await _context.Appointments
        .Where(a => a.PatientID == id && a.AppointmentDate > now && a.AppointmentStatus == "scheduled")
        .OrderBy(a => a.AppointmentDate)
        .ToListAsync();

        var completedAppointments = await _context.Appointments
        .Where(a => a.PatientID == id && a.AppointmentStatus == "completed")
        .OrderByDescending(a => a.AppointmentDate)
        .ToListAsync();

        var topDoctorData = await _context.Appointments
        .Where(a => a.PatientID == id)
        .GroupBy(a => a.DoctorID)
        .Select(g => new { DoctorID = g.Key, Count = g.Count() })
        .OrderByDescending(g => g.Count)
        .FirstOrDefaultAsync();

        var topDoctor = topDoctorData != null
        ? await _context.Doctors.FindAsync(topDoctorData.DoctorID)
        : null;

        return Ok(new
        {
        totalAppointments,
        upcomingAppointmentsCount = upcomingAppointments.Count,
        nextUpcomingDate = upcomingAppointments.FirstOrDefault()?.AppointmentDate,
        completedAppointmentsCount = completedAppointments.Count,
        lastCompletedDate = completedAppointments.FirstOrDefault()?.AppointmentDate,
        topDoctorName = topDoctor?.FullName,
        topDoctorAppointments = topDoctorData?.Count ?? 0
        });
        }
        
        // GET: api/Appointment/dashboard/stats
        [HttpGet("dashboard/stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var now = DateTime.UtcNow;

            // Current month
            var startOfThisMonth = new DateTime(now.Year, now.Month, 1);
            var endOfThisMonth = startOfThisMonth.AddMonths(1);

            // Last month
            var startOfLastMonth = startOfThisMonth.AddMonths(-1);
            var endOfLastMonth = startOfThisMonth;

            // Current totals
            var totalPatients = await _context.Patients.CountAsync();
            var totalDoctors = await _context.Doctors.CountAsync();
            var totalUsers = totalPatients + totalDoctors;
            var totalAppointments = await _context.Appointments.CountAsync();

            // This month
            var appointmentsThisMonth = await _context.Appointments
                .Where(a => a.AppointmentDate >= startOfThisMonth && a.AppointmentDate < endOfThisMonth)
                .ToListAsync();

            var activeDoctorsThisMonth = appointmentsThisMonth
                .Select(a => a.DoctorID)
                .Distinct()
                .Count();

            var totalAppointmentsThisMonth = appointmentsThisMonth.Count;

            // Last month
            var appointmentsLastMonth = await _context.Appointments
                .Where(a => a.AppointmentDate >= startOfLastMonth && a.AppointmentDate < endOfLastMonth)
                .ToListAsync();

            var activeDoctorsLastMonth = appointmentsLastMonth
                .Select(a => a.DoctorID)
                .Distinct()
                .Count();

            var totalAppointmentsLastMonth = appointmentsLastMonth.Count;

            // Users last month (created before end of last month)
            var totalPatientsLastMonth = await _context.Patients
                .Where(p => p.CreatedAt < endOfLastMonth)
                .CountAsync();

            var totalDoctorsLastMonth = await _context.Doctors
                .Where(d => d.CreatedAt < endOfLastMonth)
                .CountAsync();

            var totalUsersLastMonth = totalPatientsLastMonth + totalDoctorsLastMonth;

            // Appointment Rate
            double appointmentRate = totalUsers > 0
                ? Math.Round(totalAppointmentsThisMonth / (double)totalUsers * 100, 2)
                : 0;

            double lastMonthAppointmentRate = totalUsersLastMonth > 0
                ? Math.Round(totalAppointmentsLastMonth / (double)totalUsersLastMonth * 100, 2)
                : 0;

            // Growth Calculations
            double CalcGrowth(int current, int previous) =>
                previous == 0 ? (current > 0 ? 100 : 0) : Math.Round((current - previous) / (double)previous * 100, 2);

            double CalcGrowthDouble(double current, double previous) =>
                previous == 0 ? (current > 0 ? 100 : 0) : Math.Round((current - previous) / previous * 100, 2);

            var result = new
            {
                totalUsers,
                totalPatients,
                totalDoctors,
                totalAppointments,
                activeDoctors = activeDoctorsThisMonth,
                appointmentRate,

                growth = new
                {
                    usersGrowth = CalcGrowth(totalUsers, totalUsersLastMonth),
                    patientsGrowth = CalcGrowth(totalPatients, totalPatientsLastMonth),
                    doctorsGrowth = CalcGrowth(totalDoctors, totalDoctorsLastMonth),
                    appointmentsGrowth = CalcGrowth(totalAppointmentsThisMonth, totalAppointmentsLastMonth),
                    activeDoctorsGrowth = CalcGrowth(activeDoctorsThisMonth, activeDoctorsLastMonth),
                    appointmentRateGrowth = CalcGrowthDouble(appointmentRate, lastMonthAppointmentRate)
                }
            };

            return Ok(result);
        }
    
        // GET: api/Appointment/monthly
        [HttpGet("monthly")]
        public async Task<IActionResult> GetMonthlyAppointments()
        {
            var currentYear = DateTime.UtcNow.Year;

            var monthlyData = await _context.Appointments
                .Where(a => a.AppointmentDate.Year == currentYear)
                .GroupBy(a => a.AppointmentDate.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            var result = Enumerable.Range(1, 12)
                .Select(month => new
                {
                    month = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(month),
                    appointments = monthlyData.FirstOrDefault(m => m.Month == month)?.Count ?? 0
                });

            return Ok(result);
        }
    
        // GET: api/Appointment/monthly/1
        [HttpGet("monthly/{id}")]
        public async Task<IActionResult> GetMonthlyAppointments(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound();

            var start = new DateTime(patient.CreatedAt.Year, patient.CreatedAt.Month, 1);
            var data = new List<object>();

            for (int i = 0; i < 12; i++)
            {
                var currentMonth = start.AddMonths(i);
                var nextMonth = currentMonth.AddMonths(1);

                int count = await _context.Appointments
                    .Where(a => a.PatientID == id
                        && a.AppointmentDate >= currentMonth
                        && a.AppointmentDate < nextMonth)
                    .CountAsync();

                data.Add(new
                {
                    month = currentMonth.ToString("MMM"),
                    appointments = count
                });
            }

            return Ok(data);
        }
    
    }
}