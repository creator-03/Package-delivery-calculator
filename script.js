document.addEventListener("DOMContentLoaded", function () {
  const calculateButton = document.getElementById("calculate");
  const startDropdown = document.getElementById("start");
  const endDropdown = document.getElementById("end");
  const startDateInput = document.getElementById("startDate");
  const resultDisplay = document.getElementById("result");

  calculateButton.addEventListener("click", function () {
    const startLocation = startDropdown.value;
    const endLocation = endDropdown.value;
    const startDateStr = startDateInput.value;
    const startDate = new Date(startDateStr);

    let resultText;

    const shortestRoute = dijkstra(routeMap, startLocation, endLocation);

    if (shortestRoute.length === 0) {
      resultText = "Route not found ❌";
    } else {
      const travelDuration = shortestRoute.reduce(
        (total, location, index, array) => {
          if (index < array.length - 1) {
            return total + routeMap[location][array[index + 1]];
          }
          return total;
        },
        0
      );

      // Calculate the end date excluding weekends
      const endDate = calculateEndDate(startDate, travelDuration);
      const formattedEndDate = formatDate(endDate);

      resultText = `📦 Package will reach ${endLocation} via the shortest route in ${travelDuration} days on ${formattedEndDate}. \n`;
      resultText += `↔️ Route: ${shortestRoute.join(" -> ")}`;
    }

    resultDisplay.textContent = resultText;
  });
});

const routeMap = {
  Tirunelveli: {
    Madurai: 2,
  },
  Madurai: {
    Tirunelveli: 2,
    Trichy: 2,
    Coimbatore: 3,
    Salem: 3,
  },
  Trichy: {
    Madurai: 2,
    Chennai: 3,
  },
  Chennai: {
    Trichy: 3,
    Coimbatore: 3,
    Bangalore: 2,
    Mumbai: 5,
  },
  Coimbatore: {
    Madurai: 3,
    Chennai: 3,
    Bangalore: 3,
  },
  Salem: {
    Madurai: 3,
    Bangalore: 2,
  },
  Bangalore: {
    Salem: 2,
    Chennai: 2,
    Mumbai: 3,
  },
  Mumbai: {
    Chennai: 5,
    Bangalore: 3,
  },
};

function dijkstra(graph, start, end) {
  const visited = {};
  const distance = {};
  const previous = {};
  const queue = [];

  for (const vertex in graph) {
    if (vertex === start) {
      distance[vertex] = 0;
      queue.push({ node: vertex, cost: 0 });
    } else {
      distance[vertex] = Infinity;
      queue.push({ node: vertex, cost: Infinity });
    }
    previous[vertex] = null;
  }

  while (queue.length) {
    queue.sort((a, b) => distance[a.node] - distance[b.node]);
    const { node } = queue.shift();
    if (node === end) {
      const path = [];
      let current = end;
      while (current) {
        path.unshift(current);
        current = previous[current];
      }
      return path;
    }
    if (!visited[node]) {
      visited[node] = true;
      for (const neighbor in graph[node]) {
        const cost = graph[node][neighbor];
        const alt = distance[node] + cost;
        if (alt < distance[neighbor]) {
          distance[neighbor] = alt;
          previous[neighbor] = node;
          queue.push({ node: neighbor, cost: alt });
        }
      }
    }
  }
  return [];
}

function getDaySuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatDate(date) {
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const daySuffix = getDaySuffix(day);
  return `${day}${daySuffix} ${month}`;
}

function calculateEndDate(startDate, travelDuration) {
  const endDate = new Date(startDate);

  while (travelDuration > 0) {
    // Skip weekends (Saturday and Sunday)
    if (endDate.getDay() !== 0 && endDate.getDay() !== 6) {
      travelDuration--;
    }
    endDate.setDate(endDate.getDate() + 1);
  }

  return endDate;
}
const smallCheckbox = document.getElementById("smallCheckbox");
const mediumCheckbox = document.getElementById("mediumCheckbox");
const largeCheckbox = document.getElementById("largeCheckbox");
const selectedSize = document.getElementById("selectedSize");

// Function to update the selected size
function updateSelectedSize() {
  let selected = [];

  if (smallCheckbox.checked) {
    selected.push("Small");
  }

  if (mediumCheckbox.checked) {
    selected.push("Medium");
  }

  if (largeCheckbox.checked) {
    selected.push("Large");
  }

  selectedSize.textContent = selected.join(", ");
}

// Add click event listeners to the checkboxes
smallCheckbox.addEventListener("click", updateSelectedSize);
mediumCheckbox.addEventListener("click", updateSelectedSize);
largeCheckbox.addEventListener("click", updateSelectedSize);
