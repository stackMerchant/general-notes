Notes of Spring Boot bt ED

=================================================

Create using Spring initializer

pom.xml contains dependencies
> mvn validate
> mvn compile
> mvn test
> mvn package // makes jar and fat jar in target // fat jar contains all dependencies as well
> mvn verify
> mvn install // puts jar in ~/.m2
> mvn clean

mvnw is a wrapper and can be run as below
> ./mvnw <command>

=================================================

IOC container / application context provides beans
@Component puts class in IOC container, makes it a bean
@Autowired helps get from IOC container

@SpringApplication adds 3 as follows:
1. @Configuration // tells Spring that the class contains one or more @Bean methods.
2. @EnableAutoConfiguration
3. @ComponentScan // scan for @Component inside only current package

@RestController
@GetMapping("/home")

=================================================

Add connection params in application.properties

Mongo entries' references get updated on next updates

=================================================

Testing

Junit

@SpringBootTest
@Test
@ParameterizedTest
@ValueSource

Mockito

@MockBean // to replace actual beans

@InjectMocks
@Mock

=================================================

Logging
Add logback.xml in src/main/resources with console and file appender

=================================================

RestTemplate to call external apis

@PostConstruct

=================================================

Kafka
Topic contains partitions
Messages with same keys in a topic goes on same partition, so ordering is maintained for that key

Consumer Offset and Consumer Group
__consumer_offset is an internal topic which stores a Consumer Group's reads
One __consumer_offset topic for each Consumer Group
Partition of topic TO Consumer of CG follows Many-to-one mapping

Segments, Commit Log and Retention Policy
Set of messages in a partition are called segments
Messages are stored in logs
Which are retented based on either size/time


