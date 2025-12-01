import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ResultsDisplay from '../components/ResultsDisplay.vue';
import type { AnalysisResponse } from '../types/analysis';

const mockAnalysis: AnalysisResponse = {
  id: '123',
  url: 'https://example.com',
  analyzedAt: '2024-01-01T12:00:00Z',
  duration: 1500,
  result: {
    title: {
      exists: true,
      content: 'Example Page',
      isEmpty: false
    },
    images: {
      total: 5,
      withoutAlt: 2,
      missingAltImages: ['img1.jpg', 'img2.jpg']
    },
    inputs: {
      total: 3,
      withoutLabel: 1,
      inputsWithoutLabel: ['email-input']
    },
    score: 33,
    passedChecks: 1,
    totalChecks: 3
  }
};

describe('ResultsDisplay', () => {
  it('renders the analysis results', () => {
    const wrapper = mount(ResultsDisplay, {
      props: { analysis: mockAnalysis }
    });

    expect(wrapper.text()).toContain('33');
    expect(wrapper.text()).toContain('%');
    expect(wrapper.text()).toContain('1/3 verificações');
  });

  it('displays the analyzed URL', () => {
    const wrapper = mount(ResultsDisplay, {
      props: { analysis: mockAnalysis }
    });

    expect(wrapper.text()).toContain('https://example.com');
  });

  it('shows title check result', () => {
    const wrapper = mount(ResultsDisplay, {
      props: { analysis: mockAnalysis }
    });

    expect(wrapper.text()).toContain('Título da Página');
    expect(wrapper.text()).toContain('Example Page');
    expect(wrapper.text()).toContain('Aprovado');
  });

  it('shows image check result with issues', () => {
    const wrapper = mount(ResultsDisplay, {
      props: { analysis: mockAnalysis }
    });

    expect(wrapper.text()).toContain('Atributos Alt das Imagens');
    expect(wrapper.text()).toContain('5 imagens encontradas');
    expect(wrapper.text()).toContain('2 sem atributo alt');
    expect(wrapper.text()).toContain('Reprovado');
  });

  it('shows input check result with issues', () => {
    const wrapper = mount(ResultsDisplay, {
      props: { analysis: mockAnalysis }
    });

    expect(wrapper.text()).toContain('Labels dos Campos de Formulário');
    expect(wrapper.text()).toContain('3 campos encontrados');
    expect(wrapper.text()).toContain('1 sem labels associados');
  });

  it('applies correct score color class for low score', () => {
    const wrapper = mount(ResultsDisplay, {
      props: { analysis: mockAnalysis }
    });

    const scoreCircle = wrapper.find('.rounded-circle');
    expect(scoreCircle.classes()).toContain('bg-danger');
  });

  it('applies correct score color class for high score', () => {
    const goodAnalysis: AnalysisResponse = {
      ...mockAnalysis,
      result: {
        ...mockAnalysis.result,
        score: 100,
        passedChecks: 3
      }
    };

    const wrapper = mount(ResultsDisplay, {
      props: { analysis: goodAnalysis }
    });

    const scoreCircle = wrapper.find('.rounded-circle');
    expect(scoreCircle.classes()).toContain('bg-success');
  });

  it('has proper accessibility attributes', () => {
    const wrapper = mount(ResultsDisplay, {
      props: { analysis: mockAnalysis }
    });

    const article = wrapper.find('article');
    expect(article.exists()).toBe(true);

    const scoreCircle = wrapper.find('.rounded-circle');
    expect(scoreCircle.attributes('role')).toBe('img');
    expect(scoreCircle.attributes('aria-label')).toContain('33 por cento');
  });

  it('shows missing alt images in the list', () => {
    const wrapper = mount(ResultsDisplay, {
      props: { analysis: mockAnalysis }
    });

    expect(wrapper.text()).toContain('img1.jpg');
    expect(wrapper.text()).toContain('img2.jpg');
  });

  it('shows inputs without label in the list', () => {
    const wrapper = mount(ResultsDisplay, {
      props: { analysis: mockAnalysis }
    });

    expect(wrapper.text()).toContain('email-input');
  });
});
