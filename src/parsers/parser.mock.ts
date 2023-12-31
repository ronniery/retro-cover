type HTMLPagination = { starting: string; middle: string; ending: string };

const starting = `
  <div class="paginator">
    <span class="this-page">1</span>
    <a href="#">2</a>
    <a href="#">3</a>
    <a href="#">›</a>
  </div>
`;

const middle = `
  <div class="paginator">
    <a href="#">‹</a>
    <a href="#">1</a>
    <span class="this-page">2</span>
    <a href="#">3</a>
    <a href="#">›</a>
  </div>
`;

const ending = `
  <div class="paginator">
    <a href="#">‹</a>
    <a href="#">1</a>
    <a href="#">2</a>
    <span class="this-page">3</span>
  </div>
`;

export const getPaginationHtml = (): HTMLPagination => ({
  starting,
  middle,
  ending,
});
