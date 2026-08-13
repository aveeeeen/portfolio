import { nextTick } from 'vue';

export function useMermaid() {
  const renderMermaid = async () => {
    if (!process.client) return;

    await nextTick();

    const mermaidElements = document.querySelectorAll('.mermaid');
    if (mermaidElements.length === 0) return;

    try {
      const mermaidModule = await import('mermaid');
      const mermaid = mermaidModule.default;

      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
      });

      await mermaid.run({
        querySelector: '.mermaid',
      });
    } catch (error) {
      console.error('Failed to render mermaid diagram:', error);
    }
  };

  return {
    renderMermaid,
  };
}
