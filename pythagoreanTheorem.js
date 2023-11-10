const pythagoreanTheorem = (x1,x2,y1,y2) => {
    const Asquared = Math.abs(x1 - x2) ** 2;
            const Bsquared = Math.abs(y1 - y2) ** 2;
            const Csquared = Asquared + Bsquared;
            return Csquared;
}