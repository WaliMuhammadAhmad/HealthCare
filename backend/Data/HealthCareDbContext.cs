using Microsoft.EntityFrameworkCore;

public class HealthCareDbContext : DbContext
{
    public HealthCareDbContext(DbContextOptions<HealthCareDbContext> options)
        : base(options) { }

    public DbSet<Admin> Admins { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<PatientNotification> PatientNotifications { get; set; }
    public DbSet<Doctor> Doctors { get; set; }
    public DbSet<Appointment> Appointments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Relationships
        modelBuilder.Entity<PatientNotification>()
            .HasOne(pn => pn.Patient)
            .WithMany(p => p.Notifications)
            .HasForeignKey(pn => pn.PatientID);

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Patient)
            .WithMany(p => p.Appointments)
            .HasForeignKey(a => a.PatientID);

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Doctor)
            .WithMany(d => d.Appointments)
            .HasForeignKey(a => a.DoctorID);
    }
}
