import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import QRCodePix from './QRCodePix';

const theme = createTheme();

const renderQRCodePix = (props = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <QRCodePix
        chavePix="12345678901"
        valor={100.5}
        descricao="Pagamento teste"
        {...props}
      />
    </ThemeProvider>
  );
};

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
  });
});

test('renderiza titulo QR Code PIX', () => {
  renderQRCodePix();
  expect(screen.getByText(/QR Code PIX/i)).toBeInTheDocument();
});

test('renderiza campo de chave PIX', () => {
  renderQRCodePix();
  expect(screen.getByDisplayValue('12345678901')).toBeInTheDocument();
});

test('renderiza campo de valor', () => {
  renderQRCodePix();
  expect(screen.getByDisplayValue('R$ 100,50')).toBeInTheDocument();
});

test('renderiza campo de descricao', () => {
  renderQRCodePix();
  expect(screen.getByDisplayValue('Pagamento teste')).toBeInTheDocument();
});

test('renderiza QRCodeSVG quando chave PIX esta presente', () => {
  const { container } = renderQRCodePix();
  const svg = container.querySelector('svg');
  expect(svg).toBeInTheDocument();
});

test('exibe placeholder quando chave PIX esta vazia', () => {
  renderQRCodePix({ chavePix: '' });
  expect(screen.getByText(/Informe a chave PIX/i)).toBeInTheDocument();
});

test('nao renderiza QR Code quando chave PIX esta vazia', () => {
  const { container } = renderQRCodePix({ chavePix: '' });
  const svg = container.querySelector('svg');
  expect(svg).not.toBeInTheDocument();
});

test('nao renderiza campos opcionais quando nao fornecidos', () => {
  renderQRCodePix({ valor: 0, descricao: '' });
  expect(screen.queryByDisplayValue('R$ 0,00')).not.toBeInTheDocument();
});

test('exibe botao baixar PNG quando chave PIX esta presente', () => {
  renderQRCodePix();
  expect(screen.getByRole('button', { name: /baixar png/i })).toBeInTheDocument();
});

test('exibe botao copiar payload', () => {
  renderQRCodePix();
  expect(screen.getByTitle(/copiar payload/i)).toBeInTheDocument();
});

test('renderiza payload apos interacao', async () => {
  renderQRCodePix();
  fireEvent.click(screen.getByTitle(/copiar payload/i));
  await waitFor(() => {
    expect(screen.getByText(/payload/i)).toBeInTheDocument();
  });
});

test('formatar chave CPF corretamente', () => {
  renderQRCodePix({ chavePix: '12345678901' });
  expect(screen.getByText('123.456.789-01')).toBeInTheDocument();
});

test('formatar chave CNPJ corretamente', () => {
  renderQRCodePix({ chavePix: '12345678000195' });
  expect(screen.getByText('12.345.678/0001-95')).toBeInTheDocument();
});

test('chama onPayloadGerado quando gerado', () => {
  const onPayloadGerado = jest.fn();
  renderQRCodePix({ onPayloadGerado });
  fireEvent.click(screen.getByTitle(/copiar payload/i));
  expect(onPayloadGerado).toHaveBeenCalledWith(
    expect.objectContaining({ payload: expect.any(String) })
  );
});

test('copiar payload usa clipboard API', async () => {
  renderQRCodePix();
  fireEvent.click(screen.getByTitle(/copiar payload/i));
  await waitFor(() => {
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});

test('QRCodeSVG recebe tamanho correto', () => {
  const { container } = renderQRCodePix({ tamanho: 128 });
  const svg = container.querySelector('svg');
  expect(svg).toHaveAttribute('width', '128');
  expect(svg).toHaveAttribute('height', '128');
});

test('nao exibe botao baixar quando chave PIX esta vazia', () => {
  renderQRCodePix({ chavePix: '' });
  expect(screen.queryByRole('button', { name: /baixar png/i })).not.toBeInTheDocument();
});
