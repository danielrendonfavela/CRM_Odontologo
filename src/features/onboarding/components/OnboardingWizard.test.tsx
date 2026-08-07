import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { OnboardingWizard } from './OnboardingWizard';

describe('OnboardingWizard', () => {
  test('OnboardingWizard debe avanzar del paso 1 al 2 al ingresar el nombre del consultorio', () => {
    render(<OnboardingWizard onComplete={vi.fn()} />);

    expect(screen.getByText('Nombre del Consultorio')).toBeInTheDocument();

    const clinicInput = screen.getByLabelText(/Nombre del Consultorio/i);
    const doctorInput = screen.getByLabelText(/Nombre del Odontólogo/i);
    const nextButton = screen.getByRole('button', { name: /Siguiente/i });

    fireEvent.change(clinicInput, { target: { value: 'Mi Clínica Dental' } });
    fireEvent.change(doctorInput, { target: { value: 'Dr. Ejemplo' } });

    expect(nextButton).not.toBeDisabled();
    fireEvent.click(nextButton);

    expect(screen.getByText('Logo y Perfil de Marca')).toBeInTheDocument();
  });

  test('OnboardingWizard debe emitir onComplete con los datos de marca al finalizar el paso 3', async () => {
    const handleComplete = vi.fn().mockResolvedValue(undefined);
    render(<OnboardingWizard onComplete={handleComplete} />);

    // Step 1
    fireEvent.change(screen.getByLabelText(/Nombre del Consultorio/i), { target: { value: 'Consultorio Central' } });
    fireEvent.change(screen.getByLabelText(/Nombre del Odontólogo/i), { target: { value: 'Dr. Roberto' } });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    // Step 2
    fireEvent.change(screen.getByLabelText(/URL del Logo/i), { target: { value: 'https://ejemplo.com/logo.png' } });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    // Step 3
    fireEvent.change(screen.getByLabelText(/Cédula Profesional/i), { target: { value: 'CED-123456' } });
    fireEvent.change(screen.getByLabelText(/Teléfono del Consultorio/i), { target: { value: '555-0199' } });

    const finishButton = screen.getByRole('button', { name: /Finalizar Configuración/i });
    fireEvent.click(finishButton);

    await waitFor(() => {
      expect(handleComplete).toHaveBeenCalledTimes(1);
      expect(handleComplete).toHaveBeenCalledWith({
        clinicName: 'Consultorio Central',
        doctorName: 'Dr. Roberto',
        logoUrl: 'https://ejemplo.com/logo.png',
        professionalId: 'CED-123456',
        phone: '555-0199',
      });
    });
  });

  test('debe reiniciar el estado al presionar Probar Onboarding Demo', () => {
    const handleSkipDemo = vi.fn();
    render(<OnboardingWizard onComplete={vi.fn()} onSkipDemo={handleSkipDemo} />);

    fireEvent.change(screen.getByLabelText(/Nombre del Consultorio/i), { target: { value: 'Consultorio a Borrar' } });
    fireEvent.change(screen.getByLabelText(/Nombre del Odontólogo/i), { target: { value: 'Dr. Borrar' } });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    const demoButton = screen.getByRole('button', { name: /Probar Onboarding Demo/i });
    fireEvent.click(demoButton);

    expect(handleSkipDemo).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Nombre del Consultorio')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre del Consultorio/i)).toHaveValue('');
  });
});
