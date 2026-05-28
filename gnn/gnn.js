
    const N = 1200;
    const X = new Float64Array(N);
    const SQRT_2PI = Math.sqrt(2 * Math.PI);

    for (let i = 0; i < N; i++) {
      X[i] = -10 + 35 * i / (N - 1);}

    function gaussian(x, mu, sigma) {
      const z = (x - mu) / sigma;
      return Math.exp(-0.5 * z * z) / (sigma * SQRT_2PI);}

    function computeDensities(mu1, sigma1, mu2, sigma2, t) {
      const Ymix = new Array(N);
      const Y1 = new Array(N);
      const Y2 = new Array(N);

      for (let i = 0; i < N; i++) {
        const x = X[i];
        const y1 = gaussian(x, mu1, sigma1);
        const y2 = gaussian(x, mu2, sigma2);
        Y1[i] = y1;
        Y2[i] = y2;

        Ymix[i] = (1 - t) * y1 + t * y2;}
      return { Y1, Y2, Ymix };}

    function drawPlot() {
      const mu1 = parseFloat(document.getElementById("mu1").value);
      const sigma1 = parseFloat(document.getElementById("sigma1").value);
      const mu2 = parseFloat(document.getElementById("mu2").value);
      const sigma2 = parseFloat(document.getElementById("sigma2").value);
      const t = parseFloat(document.getElementById("tSlider").value);

      document.getElementById("tValue").innerText = t.toFixed(3);

      const { Y1, Y2, Ymix } =
        computeDensities(mu1, sigma1, mu2, sigma2, t);

      const trace1 = {
        x: Array.from(X),
        y: Y1,
        mode: "lines",
        line: {
          width: 3,
          color: "rgba(255,220,0,1)"
        },
        name: "Left Density"
      };

      const trace2 = {
        x: Array.from(X),
        y: Y2,
        mode: "lines",
        line: {
          width: 3,
          color: "rgba(50,255,255,1)"
        },
        name: "Right Density"
      };

      /* vibrant interpolation color */
      const r = Math.round((1 - t) * 255 + t * 100);
      const g = Math.round((1 - t) * 220 + t * 170);
      const b = Math.round((1 - t) * 0 + t * 255);
      const traceMix = {
        x: Array.from(X),
        y: Ymix,
        mode: "lines",
        line: {
          width: 6,
          color: `rgb(${r},${g},${b})`
        },
        fill: "tozeroy",
        fillcolor: `rgba(${r},${g},${b},0.18)`,
        name: "Interpolated Density"
      };
      const layout = {
        paper_bgcolor: "#000",
        plot_bgcolor: "#000",

        width: 800,
        height: 400,

        font: { color: "#EAEAEA" },
        margin: { l: 70, r: 30, t: 50, b: 60 },

        title: {
          text: `Density Interpolation   |   t = ${t.toFixed(3)}`,
          font: {size: 22}},

        xaxis: {
          range: [-10, 25],
          gridcolor: "#222",
          zerolinecolor: "#333",
          title: "x"},
        yaxis: {
          range: [0, 0.5],
          gridcolor: "#222",
          zerolinecolor: "#333",
          title: "density"},
        legend: {
          orientation: "h",
          y: 1.08}
      };

      Plotly.react(
        "gaussianPlot",
        [trace1, trace2, traceMix],
        layout,
        {displayModeBar: false}
      );
    }
    ["mu1", "sigma1", "mu2", "sigma2", "tSlider"].forEach(id => {
      document
        .getElementById(id)
        .addEventListener("input", drawPlot);
    });
    drawPlot();

