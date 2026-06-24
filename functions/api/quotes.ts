const quotes = [
  { id: 'quote-1', text: 'English is the hottest new programming language.', author: 'Andrej Karpathy', context: 'Software 2.0 & LLM-OS' },
  { id: 'quote-2', text: 'The bitter lesson is that general methods that leverage computation are the most effective, by a large margin.', author: 'Rich Sutton', context: 'The Bitter Lesson (2019)' },
  { id: 'quote-3', text: 'Alignment is a high-precision clinical discipline.', author: 'Ilya Sutskever', context: 'AGI Alignment Research' },
  { id: 'quote-4', text: 'The software of the future is less written, and more grown as neural networks.', author: 'Andrej Karpathy', context: 'Medium (2017)' },
  { id: 'quote-5', text: 'The measure of intelligence is the ability to change.', author: 'Albert Einstein', context: 'Cognitive Adaptability' },
  { id: 'quote-6', text: 'Simplicity is the ultimate sophistication. Complex systems fail at their interfaces.', author: 'Edsger Dijkstra', context: 'Structured Programming' },
];

export const onRequestGet = async (context: any) => {
  return new Response(JSON.stringify({ quotes }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
