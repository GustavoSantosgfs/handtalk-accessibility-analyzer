import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import AnalyzerForm from '../components/AnalyzerForm.vue';

describe('AnalyzerForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders the form correctly', () => {
    const wrapper = mount(AnalyzerForm);

    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="url"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    expect(wrapper.find('label[for="url-input"]').exists()).toBe(true);
  });

  it('has proper accessibility attributes', () => {
    const wrapper = mount(AnalyzerForm);

    const form = wrapper.find('form');
    expect(form.attributes('role')).toBe('search');
    expect(form.attributes('aria-label')).toBe('URL analyzer form');

    const input = wrapper.find('input');
    expect(input.attributes('id')).toBe('url-input');
    expect(input.attributes('aria-describedby')).toBe('url-hint');

    const hint = wrapper.find('#url-hint');
    expect(hint.exists()).toBe(true);
  });

  it('disables submit button when input is empty', () => {
    const wrapper = mount(AnalyzerForm);

    const button = wrapper.find('button[type="submit"]');
    expect(button.attributes('disabled')).toBeDefined();
  });

  it('enables submit button when input has value', async () => {
    const wrapper = mount(AnalyzerForm);

    const input = wrapper.find('input');
    await input.setValue('https://example.com');

    const button = wrapper.find('button[type="submit"]');
    expect(button.attributes('disabled')).toBeUndefined();
  });

  it('updates v-model when typing', async () => {
    const wrapper = mount(AnalyzerForm);

    const input = wrapper.find('input');
    await input.setValue('https://test.com');

    expect((input.element as HTMLInputElement).value).toBe('https://test.com');
  });
});
