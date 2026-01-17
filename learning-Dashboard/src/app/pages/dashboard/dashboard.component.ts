import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { ChartConfiguration, Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  summary: any;
  courseProgress: any[] = [];
  passStats: any;

  // Course Progress Chart
  courseChartData!: ChartConfiguration<'bar'>['data'];
  courseChartOptions!: ChartConfiguration<'bar'>['options'];

  // Pass Percentage Chart
  passChartData!: ChartConfiguration<'bar'>['data'];
  passChartOptions!: ChartConfiguration<'bar'>['options'];
  
  assessmentCompletion: any;

donutChartData!: ChartConfiguration<'doughnut'>['data'];
donutChartOptions!: ChartConfiguration<'doughnut'>['options'];

  gradeBreakdown!: any[];

gradeChartData!: ChartConfiguration<'pie'>['data'];
gradeChartOptions!: ChartConfiguration<'pie'>['options'];
districtRanking: any;



  constructor(
    private dashboardService: DashboardService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    Chart.register(...registerables);

    this.dashboardService.getDashboard().subscribe(data => {
      this.summary = data.summary;
this.courseProgress = data.courseProgress;
this.passStats = data.passStats;
this.assessmentCompletion = data.assessmentCompletion;
this.gradeBreakdown = data.gradeBreakdown;
this.districtRanking = data.districtRanking;

this.buildCourseProgressChart();
this.buildPassChart();
this.buildDonutChart();
this.buildGradeChart();


    });
  }

  // ✅ Course Progress (VERTICAL)
  buildCourseProgressChart() {
    this.courseChartData = {
      labels: this.courseProgress.map(d => d.district),
      datasets: [
        {
          label: 'Below',
          data: this.courseProgress.map(d => d.below),
          backgroundColor: '#ef4444'
        },
        {
          label: 'Average',
          data: this.courseProgress.map(d => d.average),
          backgroundColor: '#22c55e'
        },
        {
          label: 'Good',
          data: this.courseProgress.map(d => d.good),
          backgroundColor: '#3b82f6'
        }
      ]
    };

    this.courseChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.body)
              .getPropertyValue('--text')
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.body)
              .getPropertyValue('--text')
          }
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: getComputedStyle(document.body)
              .getPropertyValue('--text')
          }
        }
      }
    };
  }

  // ✅ Pass Percentage (HORIZONTAL)
  buildPassChart() {
    this.passChartData = {
      labels: [
        'Overall Learners',
        'Assessment Taken',
        'Passed',
        'Failed'
      ],
      datasets: [
        {
          data: [
            this.passStats.overallLearners,
            this.passStats.assessmentTaken,
            this.passStats.passed,
            this.passStats.failed
          ],
          backgroundColor: [
            '#38bdf8',
            '#22d3ee',
            '#22c55e',
            '#ef4444'
          ],
          borderRadius: 6
        }
      ]
    };

    this.passChartOptions = {
      responsive: true,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.body)
              .getPropertyValue('--text')
          }
        },
        y: {
          ticks: {
            color: getComputedStyle(document.body)
              .getPropertyValue('--text')
          }
        }
      }
    };
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
  buildDonutChart() {
  this.donutChartData = {
    labels: ['Assessment Completed', 'Not Completed'],
    datasets: [
      {
        data: [
          this.assessmentCompletion.completedPercent,
          this.assessmentCompletion.notCompletedPercent
        ],
        backgroundColor: ['#3b82f6', '#f59e0b'],
        borderWidth: 0
      }
    ]
  };

this.donutChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 16,
        color: getComputedStyle(document.body)
          .getPropertyValue('--text')
      }
    }
  }
};
  }
buildGradeChart() {
  this.gradeChartData = {
    labels: this.gradeBreakdown.map(g => g.label),
    datasets: [
      {
        data: this.gradeBreakdown.map(g => g.percent),
        backgroundColor: [
          '#60a5fa', // A
          '#22c55e', // B
          '#facc15', // C
          '#fb923c', // D
          '#ef4444'  // E
        ],
        borderWidth: 0
      }
    ]
  };

this.gradeChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'right', // 🔥 matches design
      labels: {
        padding: 14,
        boxWidth: 14,
        color: getComputedStyle(document.body)
          .getPropertyValue('--text')
      }
    }
  }
};
}

}
